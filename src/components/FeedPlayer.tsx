import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ReelCard } from './ReelCard';
import { BreedDetailsModal } from './BreedDetailsModal';
import { curatedCatVideos, randomCaptions, randomUsernames, randomHashtags } from '../data/videoData';
import type { CatReelItem, BreedInfo } from '../data/videoData';

interface FeedPlayerProps {
  filterMode: 'all' | 'videos' | 'gifs';
}

export const FeedPlayer: React.FC<FeedPlayerProps> = ({ filterMode }) => {
  const [items, setItems] = useState<CatReelItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('cat_reels_muted');
    return saved ? JSON.parse(saved) : true;
  });
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('cat_reels_liked');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('cat_reels_bookmarked');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedBreed, setSelectedBreed] = useState<BreedInfo | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Sync mute to localStorage
  useEffect(() => {
    localStorage.setItem('cat_reels_muted', JSON.stringify(isMuted));
  }, [isMuted]);

  // Sync likes to localStorage
  useEffect(() => {
    localStorage.setItem('cat_reels_liked', JSON.stringify(Array.from(likedIds)));
  }, [likedIds]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('cat_reels_bookmarked', JSON.stringify(Array.from(bookmarkedIds)));
  }, [bookmarkedIds]);

  // Fetch from Cat API to grow list infinitely
  const fetchCatApiItems = useCallback(async (limit = 10, mode: 'all' | 'videos' | 'gifs' = 'all') => {
    setIsLoadingMore(true);
    try {
      let url = `https://api.thecatapi.com/v1/images/search?limit=${limit}`;
      
      if (mode === 'gifs') {
        url += '&mime_types=gif';
      } else if (mode === 'all') {
        url += '&mime_types=jpg,png,gif&has_breeds=1';
      } else {
        // videos only - we don't fetch from Cat API because it doesn't serve MP4 video formats.
        // We can fall back to mixing static files or GIFs.
        url += '&mime_types=gif&has_breeds=1';
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();

      const newReels: CatReelItem[] = data.map((d: any, idx: number) => {
        const hasBreed = d.breeds && d.breeds.length > 0;
        const breedData = hasBreed ? d.breeds[0] : undefined;

        // Pick random details
        const randomUser = randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
        const randomCap = randomCaptions[Math.floor(Math.random() * randomCaptions.length)];
        const randomTags = randomHashtags[Math.floor(Math.random() * randomHashtags.length)];

        return {
          id: d.id + '_' + Date.now() + '_' + idx,
          type: d.url.endsWith('.gif') ? 'gif' : 'image',
          url: d.url,
          username: randomUser,
          caption: breedData ? `Introducing the gorgeous ${breedData.name}! 🐾 ${breedData.temperament}` : randomCap,
          hashtags: breedData ? [breedData.name.replace(/\s+/g, ''), 'catbreed', 'meow'] : randomTags,
          likes: Math.floor(Math.random() * 5000) + 500,
          bookmarks: Math.floor(Math.random() * 1000) + 100,
          breed: breedData ? {
            id: breedData.id,
            name: breedData.name,
            origin: breedData.origin,
            temperament: breedData.temperament,
            description: breedData.description,
            life_span: breedData.life_span,
            energy_level: breedData.energy_level,
            affection_level: breedData.affection_level,
            intelligence: breedData.intelligence,
            social_needs: breedData.social_needs,
            wikipedia_url: breedData.wikipedia_url
          } : undefined
        };
      });

      return newReels;
    } catch (err) {
      console.error("Error fetching cat items:", err);
      return [];
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  // Initialize and filter items
  useEffect(() => {
    let active = true;
    const initializeFeed = async () => {
      setItems([]);
      setActiveIndex(0);

      let initialList: CatReelItem[] = [];

      if (filterMode === 'all') {
        // Start with some curated video assets and fetch some Cat API images/gifs
        initialList = [...curatedCatVideos];
        const apiItems = await fetchCatApiItems(6, 'all');
        if (active) {
          // Shuffle or interleave them
          const combined = [...initialList];
          apiItems.forEach((item, index) => {
            // Insert at alternating positions
            const insertPos = (index * 2) + 1;
            if (insertPos < combined.length) {
              combined.splice(insertPos, 0, item);
            } else {
              combined.push(item);
            }
          });
          setItems(combined);
        }
      } else if (filterMode === 'videos') {
        // Only seed videos
        setItems(curatedCatVideos);
      } else if (filterMode === 'gifs') {
        // Only GIFs
        const apiGifs = await fetchCatApiItems(10, 'gifs');
        if (active) setItems(apiGifs);
      }
    };

    initializeFeed();
    return () => { active = false; };
  }, [filterMode, fetchCatApiItems]);

  // Load more trigger
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    
    if (filterMode === 'videos') {
      // Loop the videos database to simulate continuous scrolling
      const loopedVideos = curatedCatVideos.map((video) => ({
        ...video,
        id: `${video.id}_loop_${Date.now()}`
      }));
      setItems((prev) => [...prev, ...loopedVideos]);
    } else {
      const extraItems = await fetchCatApiItems(10, filterMode);
      if (extraItems.length > 0) {
        setItems((prev) => [...prev, ...extraItems]);
      }
    }
  }, [filterMode, fetchCatApiItems, isLoadingMore]);

  // Set up Intersection Observer for snap scrolling tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-index');
            if (indexAttr !== null) {
              const index = parseInt(indexAttr, 10);
              setActiveIndex(index);

              // Fetch more when approaching the end of the list (last 3 items)
              if (index >= items.length - 3) {
                handleLoadMore();
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6, // Fire when 60% of target is visible
      }
    );

    // Observe each child card
    const cards = container.querySelectorAll('.reel-card-wrapper');
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, [items, handleLoadMore]);

  // Handle keyboard navigation (Up/Down arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container || selectedBreed) return; // ignore when modal is open

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(activeIndex + 1, items.length - 1);
        const nextCard = container.querySelector(`[data-index="${nextIndex}"]`);
        nextCard?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(activeIndex - 1, 0);
        const prevCard = container.querySelector(`[data-index="${prevIndex}"]`);
        prevCard?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items.length, selectedBreed]);

  // Like toggle callback
  const handleLikeToggle = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Bookmark toggle callback
  const handleBookmarkToggle = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="feed-container">
      <div ref={containerRef} className="feed-scroll-wrapper">
        {items.map((item, idx) => (
          <div
            key={item.id}
            data-index={idx}
            className="reel-card-wrapper"
          >
            <ReelCard
              item={item}
              isActive={idx === activeIndex}
              isMuted={isMuted}
              onMuteToggle={() => setIsMuted(!isMuted)}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
              isLiked={likedIds.has(item.id)}
              isBookmarked={bookmarkedIds.has(item.id)}
              onShowBreed={() => setSelectedBreed(item.breed || null)}
            />
          </div>
        ))}

        {isLoadingMore && (
          <div className="feed-loader-bottom">
            <div className="spinner"></div>
            <span>Finding more kittens... 🐾</span>
          </div>
        )}
      </div>

      {selectedBreed && (
        <BreedDetailsModal
          breed={selectedBreed}
          onClose={() => setSelectedBreed(null)}
        />
      )}
    </div>
  );
};
