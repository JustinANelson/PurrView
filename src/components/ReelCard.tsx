import React, { useRef, useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, Info, Volume2, VolumeX, Play, Pause, MessageSquare } from 'lucide-react';
import type { CatReelItem } from '../data/videoData';
import { playMeowSound } from '../utils/audioHelper';
import { CommentsDrawer } from './CommentsDrawer';

interface ReelCardProps {
  item: CatReelItem;
  isActive: boolean;
  isMuted: boolean;
  onMuteToggle: () => void;
  onLikeToggle: (id: string) => void;
  onBookmarkToggle: (id: string) => void;
  isLiked: boolean;
  isBookmarked: boolean;
  onShowBreed: () => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  item,
  isActive,
  isMuted,
  onMuteToggle,
  onLikeToggle,
  onBookmarkToggle,
  isLiked,
  isBookmarked,
  onShowBreed,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [heartAnims, setHeartAnims] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showPlayStateOverlay, setShowPlayStateOverlay] = useState<'play' | 'pause' | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const cleanId = item.id.split('_')[0];

  useEffect(() => {
    const saved = localStorage.getItem(`comments_${cleanId}`);
    if (saved) {
      setCommentCount(JSON.parse(saved).length);
    } else {
      setCommentCount(cleanId.startsWith('v') ? 2 : 1);
    }
  }, [item.id, cleanId]);

  // Sync video play/pause with isActive state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || item.type !== 'video') return;

    if (isActive) {
      setIsLoading(true);
      video.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("Autoplay was prevented:", err);
          setIsPlaying(false);
          setIsLoading(false);
        });
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, item.type]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type !== 'video' || !videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerOverlayAction('pause');
    } else {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          triggerOverlayAction('play');
        });
    }
  };

  const triggerOverlayAction = (state: 'play' | 'pause') => {
    setShowPlayStateOverlay(state);
    setTimeout(() => {
      setShowPlayStateOverlay(null);
    }, 500);
  };

  // Double Click / Double Tap for Heart
  const lastTapRef = useRef<number>(0);
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      handleDoubleTap(e);
    } else {
      // Single tap (pause/play)
      handleTogglePlay(e);
    }
    lastTapRef.current = now;
  };

  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLiked) {
      onLikeToggle(item.id);
    }
    
    // Play synthesized meow sound!
    playMeowSound();

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newHeart = { id: Date.now(), x, y };

      setHeartAnims((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setHeartAnims((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 800);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const deepLink = `${window.location.origin}?reel=${item.id}`;
    
    const shareData = {
      title: 'Check out this awesome cat!',
      text: item.caption,
      url: deepLink
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(deepLink);
      alert('Link copied to clipboard! 🐾');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`reel-card ${isActive ? 'active' : ''}`}
      onClick={handleCardClick}
    >
      {/* Blurred background image for aesthetics */}
      <div
        className="reel-background-blur"
        style={{ backgroundImage: `url(${item.url})` }}
      />

      {/* Main Media Content */}
      <div className="reel-media-wrapper">
        {isLoading && (
          <div className="reel-loader">
            <div className="spinner"></div>
          </div>
        )}

        {item.type === 'video' ? (
          <video
            ref={videoRef}
            src={item.url}
            loop
            playsInline
            muted={isMuted}
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            className="reel-media-element"
          />
        ) : (
          <img
            src={item.url}
            alt={item.caption}
            onLoad={() => setIsLoading(false)}
            className="reel-media-element object-contain"
          />
        )}
      </div>

      {/* Floating play/pause state indicator */}
      {showPlayStateOverlay && (
        <div className="play-state-overlay animate-scale-up">
          {showPlayStateOverlay === 'play' ? <Play size={48} /> : <Pause size={48} />}
        </div>
      )}

      {/* Double tap heart animations */}
      {heartAnims.map((heart) => (
        <div
          key={heart.id}
          className="double-tap-heart animate-float-heart"
          style={{ left: heart.x - 40, top: heart.y - 40 }}
        >
          <Heart size={80} fill="#ff4d4d" stroke="#ff4d4d" />
        </div>
      ))}

      {/* Left side Metadata info */}
      <div className="reel-left-overlay" onClick={(e) => e.stopPropagation()}>
        <h3 className="reel-username">@{item.username}</h3>
        <p className="reel-caption">
          {item.caption}{' '}
          {item.hashtags.map((tag) => (
            <span key={tag} className="reel-hashtag">
              #{tag}{' '}
            </span>
          ))}
        </p>
        
        {item.breed && (
          <button className="breed-badge" onClick={onShowBreed}>
            <Info size={14} />
            <span>Breed: {item.breed.name}</span>
          </button>
        )}
      </div>

      {/* Right side controls */}
      <div className="reel-right-controls" onClick={(e) => e.stopPropagation()}>
        <button
          className={`control-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLikeToggle(item.id)}
          aria-label="Like video"
        >
          <Heart size={28} fill={isLiked ? '#ff4d4d' : 'transparent'} />
          <span className="control-count">
            {isLiked ? (item.likes + 1).toLocaleString() : item.likes.toLocaleString()}
          </span>
        </button>

        <button
          className={`control-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={() => onBookmarkToggle(item.id)}
          aria-label="Bookmark video"
        >
          <Bookmark size={28} fill={isBookmarked ? '#ffd700' : 'transparent'} />
          <span className="control-count">
            {isBookmarked ? (item.bookmarks + 1).toLocaleString() : item.bookmarks.toLocaleString()}
          </span>
        </button>

        <button
          className="control-btn comment-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsCommentsOpen(true);
          }}
          aria-label="Open comments"
        >
          <MessageSquare size={28} />
          <span className="control-count">{commentCount.toLocaleString()}</span>
        </button>

        <button className="control-btn share-btn" onClick={handleShare} aria-label="Share video">
          <Share2 size={28} />
          <span className="control-count">Share</span>
        </button>

        {item.type === 'video' && (
          <button className="control-btn mute-btn" onClick={onMuteToggle} aria-label="Toggle mute">
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
        )}

        {item.breed && (
          <button className="control-btn info-btn" onClick={onShowBreed} aria-label="Breed information">
            <div className="breed-btn-circle animate-pulse">
              <Info size={28} />
            </div>
            <span className="control-count">Breed Info</span>
          </button>
        )}
      </div>

      {/* Progress slider at the bottom of the card for videos */}
      {item.type === 'video' && (
        <div className="reel-progress-container">
          <div className="reel-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {isCommentsOpen && (
        <CommentsDrawer itemId={item.id} onClose={() => {
          setIsCommentsOpen(false);
          const saved = localStorage.getItem(`comments_${cleanId}`);
          if (saved) {
            setCommentCount(JSON.parse(saved).length);
          }
        }} />
      )}
    </div>
  );
};
