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

  // Helper to compute the user's favorite breed based on liked cards
  const getPreferredBreedId = useCallback(() => {
    const likedBreeds = JSON.parse(localStorage.getItem('cat_reels_liked_breeds') || '[]');
    const breedCounts: Record<string, number> = {};

    likedBreeds.forEach((breedId: string) => {
      breedCounts[breedId] = (breedCounts[breedId] || 0) + 1;
    });

    let bestBreed: string | null = null;
    let maxLikes = 0;
    Object.entries(breedCounts).forEach(([breedId, count]) => {
      if (count > maxLikes) {
        maxLikes = count;
        bestBreed = breedId;
      }
    });

    return bestBreed;
  }, []);

  // Fetch from Cat API to grow list infinitely
  const fetchCatApiItems = useCallback(async (limit = 10, mode: 'all' | 'videos' | 'gifs' = 'all') => {
    setIsLoadingMore(true);
    try {
      let url = `https://api.thecatapi.com/v1/images/search?limit=${limit}`;
      
      if (mode === 'gifs') {
        url += '&mime_types=gif';
      } else if (mode === 'all') {
        url += '&mime_types=jpg,png,gif&has_breeds=1';
        
        // 30% chance to fetch user's preferred breed if available
        const favBreed = getPreferredBreedId();
        if (favBreed && Math.random() < 0.3) {
          url += `&breed_ids=${favBreed}`;
        }
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
  }, [getPreferredBreedId]);

  // Initialize and filter items
  useEffect(() => {
    let active = true;
    const initializeFeed = async () => {
      setIsLoadingMore(true);
      setItems([]);
      setActiveIndex(0);

      const queryParams = new URLSearchParams(window.location.search);
      const reelId = queryParams.get('reel');
      let sharedItem: CatReelItem | null = null;
      const list = [...curatedCatVideos];

      if (reelId) {
        // Check if it's a curated video
        const curatedIndex = list.findIndex(v => v.id === reelId);
        if (curatedIndex !== -1) {
          // Move to front
          const [item] = list.splice(curatedIndex, 1);
          list.unshift(item);
        } else {
          // Fetch specific image/gif from The Cat API
          try {
            const res = await fetch(`https://api.thecatapi.com/v1/images/${reelId}`);
            if (res.ok) {
              const d = await res.json();
              const hasBreed = d.breeds && d.breeds.length > 0;
              const breedData = hasBreed ? d.breeds[0] : undefined;
              sharedItem = {
                id: d.id,
                type: d.url.endsWith('.gif') ? 'gif' : 'image',
                url: d.url,
                username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
                caption: breedData ? `Introducing the gorgeous ${breedData.name}! 🐾 ${breedData.temperament}` : randomCaptions[Math.floor(Math.random() * randomCaptions.length)],
                hashtags: breedData ? [breedData.name.replace(/\s+/g, ''), 'catbreed', 'meow'] : randomHashtags[Math.floor(Math.random() * randomHashtags.length)],
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
            }
          } catch (e) {
            console.error("Error loading shared reel:", e);
          }
        }
      }

      if (filterMode === 'all') {
        const apiItems = await fetchCatApiItems(6, 'all');
        if (active) {
          const combined = [...list];
          if (sharedItem) {
            combined.unshift(sharedItem);
          }
          apiItems.forEach((item, index) => {
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
        if (active) setItems(list);
      } else if (filterMode === 'gifs') {
        const apiGifs = await fetchCatApiItems(10, 'gifs');
        if (active) {
          if (sharedItem && sharedItem.type === 'gif') {
            apiGifs.unshift(sharedItem);
          }
          setItems(apiGifs);
        }
      }
      setIsLoadingMore(false);
    };

    initializeFeed();
    return () => { active = false; };
  }, [filterMode, fetchCatApiItems]);

  // Sync activeIndex with URL query param for deep linking
  useEffect(() => {
    if (items.length === 0) return;
    const activeItem = items[activeIndex];
    if (activeItem) {
      const url = new URL(window.location.href);
      const cleanId = activeItem.id.split('_')[0];
      url.searchParams.set('reel', cleanId);
      window.history.replaceState({}, '', url.toString());
    }
  }, [activeIndex, items]);

  // Track scroll counts and Cat-Dex unlocks in localstorage
  useEffect(() => {
    if (items.length === 0) return;
    const activeItem = items[activeIndex];
    if (!activeItem) return;

    // 1. Scroll count tracking
    const viewedStr = localStorage.getItem('cat_reels_viewed_set') || '[]';
    const viewedSet = new Set<string>(JSON.parse(viewedStr));

    if (!viewedSet.has(activeItem.id)) {
      viewedSet.add(activeItem.id);
      localStorage.setItem('cat_reels_viewed_set', JSON.stringify(Array.from(viewedSet)));
      localStorage.setItem('cat_reels_viewed_count', String(viewedSet.size));
    }

    // 2. Cat-Dex breed unlock tracking
    if (activeItem.breed) {
      const unlockedStr = localStorage.getItem('cat_reels_unlocked_breeds') || '[]';
      const unlockedSet = new Set<string>(JSON.parse(unlockedStr));
      if (!unlockedSet.has(activeItem.breed.id)) {
        unlockedSet.add(activeItem.breed.id);
        localStorage.setItem('cat_reels_unlocked_breeds', JSON.stringify(Array.from(unlockedSet)));
      }
    }
  }, [activeIndex, items]);

  // Load more trigger
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    
    if (filterMode === 'videos') {
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

              // Fetch more when approaching the end of the list
              if (index >= items.length - 3) {
                handleLoadMore();
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    const cards = container.querySelectorAll('.reel-card-wrapper');
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, [items, handleLoadMore]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container || selectedBreed) return;

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

  const handleLikeToggle = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      const match = items.find(item => item.id === id);
      
      if (next.has(id)) {
        next.delete(id);
        if (match && match.breed) {
          const likedBreeds = JSON.parse(localStorage.getItem('cat_reels_liked_breeds') || '[]');
          const idx = likedBreeds.indexOf(match.breed.id);
          if (idx !== -1) {
            likedBreeds.splice(idx, 1);
            localStorage.setItem('cat_reels_liked_breeds', JSON.stringify(likedBreeds));
          }
        }
      } else {
        next.add(id);
        if (match && match.breed) {
          const likedBreeds = JSON.parse(localStorage.getItem('cat_reels_liked_breeds') || '[]');
          likedBreeds.push(match.breed.id);
          localStorage.setItem('cat_reels_liked_breeds', JSON.stringify(likedBreeds));
        }
      }
      return next;
    });
  };

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

  const handleShowBreed = (breed: BreedInfo) => {
    setSelectedBreed(breed);
    const count = parseInt(localStorage.getItem('cat_reels_breeds_viewed_count') || '0', 10);
    localStorage.setItem('cat_reels_breeds_viewed_count', String(count + 1));
    if (breed.id === 'siam') {
      localStorage.setItem('cat_reels_siamese_viewed', 'true');
    }
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
              onShowBreed={() => item.breed && handleShowBreed(item.breed)}
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

      {/* Preload adjacent deck (next 2 items) */}
      <div style={{ display: 'none' }}>
        {items.slice(activeIndex + 1, activeIndex + 3).map((preloadItem) => {
          if (preloadItem.type === 'video') {
            return (
              <video
                key={`preload-${preloadItem.id}`}
                src={preloadItem.url}
                preload="auto"
                muted
                playsInline
              />
            );
          } else {
            return (
              <img
                key={`preload-${preloadItem.id}`}
                src={preloadItem.url}
                alt=""
              />
            );
          }
        })}
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
