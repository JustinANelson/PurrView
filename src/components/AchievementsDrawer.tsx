import React, { useEffect, useState } from 'react';
import { X, Award, Eye, Heart, Bookmark, BookOpen, Compass, Lock, Check } from 'lucide-react';

interface AchievementsDrawerProps {
  onClose: () => void;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  current: number;
  target: number;
  completed: boolean;
}

interface DexBreed {
  id: string;
  name: string;
  origin: string;
  description: string;
}

const staticDexBreeds: DexBreed[] = [
  { id: 'asho', name: 'American Shorthair', origin: 'United States', description: 'Gentle, robust, and quiet family companion.' },
  { id: 'pers', name: 'Persian', origin: 'Iran', description: 'Quiet, peaceful, and known for a luxurious coat.' },
  { id: 'siam', name: 'Siamese', origin: 'Thailand', description: 'Extremely vocal, outgoing, and deeply affectionate.' },
  { id: 'kora', name: 'Korat', origin: 'Thailand', description: 'Silver-blue coat and large green heart-melting eyes.' },
  { id: 'mcoo', name: 'Maine Coon', origin: 'United States', description: 'The gentle giant of cats. Playful and fluffy.' },
  { id: 'raga', name: 'Ragamuffin', origin: 'United States', description: 'Docile, friendly, and goes limp when you hold them.' },
  { id: 'beng', name: 'Bengal', origin: 'United States', description: 'Spotted leopard-like coat, high energy, loves water.' },
  { id: 'bslo', name: 'British Shorthair', origin: 'United Kingdom', description: 'Easygoing, quiet, loyal, and plush rounded face.' },
  { id: 'tish', name: 'Toyger', origin: 'United States', description: 'Bred to look like a miniature toy tiger.' },
  { id: 'abys', name: 'Abyssinian', origin: 'Egypt', description: 'Highly active, clever, and constantly in motion.' },
  { id: 'sphy', name: 'Sphynx', origin: 'Canada', description: 'Hairless, highly energetic, and loves warm laps.' },
  { id: 'birm', name: 'Birman', origin: 'Myanmar', description: 'Long silky coat, deep blue eyes, and white mitts.' }
];

export const AchievementsDrawer: React.FC<AchievementsDrawerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'catdex'>('badges');
  const [stats, setStats] = useState({
    viewed: 0,
    liked: 0,
    bookmarked: 0,
    breedsViewed: 0,
    siameseViewed: false
  });
  const [unlockedBreedIds, setUnlockedBreedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Read current stats from localStorage
    const liked = JSON.parse(localStorage.getItem('cat_reels_liked') || '[]');
    const bookmarked = JSON.parse(localStorage.getItem('cat_reels_bookmarked') || '[]');
    const viewed = parseInt(localStorage.getItem('cat_reels_viewed_count') || '0', 10);
    const breeds = parseInt(localStorage.getItem('cat_reels_breeds_viewed_count') || '0', 10);
    const siamese = localStorage.getItem('cat_reels_siamese_viewed') === 'true';

    // Read unlocked breed ids
    const unlocked = JSON.parse(localStorage.getItem('cat_reels_unlocked_breeds') || '[]');

    setStats({
      viewed,
      liked: liked.length,
      bookmarked: bookmarked.length,
      breedsViewed: breeds,
      siameseViewed: siamese
    });
    setUnlockedBreedIds(new Set(unlocked));
  }, []);

  const badges: Badge[] = [
    {
      id: 'b1',
      name: 'First Steps',
      description: 'Scroll through 5 cat reels',
      icon: <Eye size={20} />,
      current: stats.viewed,
      target: 5,
      completed: stats.viewed >= 5
    },
    {
      id: 'b2',
      name: 'Scroll Marathoner',
      description: 'Scroll through 25 cat reels',
      icon: <Compass size={20} />,
      current: stats.viewed,
      target: 25,
      completed: stats.viewed >= 25
    },
    {
      id: 'b3',
      name: 'Double Tap Lover',
      description: 'Give a heart to 5 different cats',
      icon: <Heart size={20} />,
      current: stats.liked,
      target: 5,
      completed: stats.liked >= 5
    },
    {
      id: 'b4',
      name: 'Purr Collector',
      description: 'Bookmark 3 cat reels to your saves',
      icon: <Bookmark size={20} />,
      current: stats.bookmarked,
      target: 3,
      completed: stats.bookmarked >= 3
    },
    {
      id: 'b5',
      name: 'Cat Scholar',
      description: 'Open breed information card 3 times',
      icon: <BookOpen size={20} />,
      current: stats.breedsViewed,
      target: 3,
      completed: stats.breedsViewed >= 3
    },
    {
      id: 'b6',
      name: 'Siamese Devotee',
      description: 'Explore the Siamese breed details card',
      icon: <Award size={20} />,
      current: stats.siameseViewed ? 1 : 0,
      target: 1,
      completed: stats.siameseViewed
    }
  ];

  const completedCount = badges.filter(b => b.completed).length;
  const unlockedBreedsCount = staticDexBreeds.filter(b => unlockedBreedIds.has(b.id)).length;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Award size={24} className="trophy-badge-icon" />
            <h2>Cat Achievements</h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close drawer">
            <X size={24} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="drawer-tab-container">
          <button
            className={`drawer-tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges ({completedCount}/{badges.length})
          </button>
          <button
            className={`drawer-tab-btn ${activeTab === 'catdex' ? 'active' : ''}`}
            onClick={() => setActiveTab('catdex')}
          >
            Cat-Dex ({unlockedBreedsCount}/{staticDexBreeds.length})
          </button>
        </div>

        {activeTab === 'badges' ? (
          <>
            <div className="achievements-summary">
              <div className="summary-circle">
                <span className="summary-num">{completedCount}</span>
                <span className="summary-of">of {badges.length}</span>
              </div>
              <p className="summary-text">Badges Unlocked. Keep scrolling to collect them all! 🏆🐱</p>
            </div>

            <div className="badges-list">
              {badges.map((badge) => {
                const percentage = Math.min((badge.current / badge.target) * 100, 100);
                return (
                  <div key={badge.id} className={`badge-card ${badge.completed ? 'completed' : ''}`}>
                    <div className={`badge-icon-wrapper ${badge.completed ? 'completed' : ''}`}>
                      {badge.icon}
                    </div>
                    <div className="badge-details">
                      <div className="badge-name-row">
                        <span className="badge-name">{badge.name}</span>
                        {badge.completed && <span className="badge-status-tag">Unlocked</span>}
                      </div>
                      <p className="badge-description">{badge.description}</p>
                      
                      <div className="badge-progress-container">
                        <div className="badge-progress-bar" style={{ width: `${percentage}%` }}></div>
                        <span className="badge-progress-text">
                          {badge.current} / {badge.target}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="catdex-container">
            <div className="catdex-grid">
              {staticDexBreeds.map((breed) => {
                const isUnlocked = unlockedBreedIds.has(breed.id);
                return (
                  <div key={breed.id} className={`catdex-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <div className="catdex-header-row">
                      <span className="catdex-breed-name">{breed.name}</span>
                      {isUnlocked ? (
                        <span className="catdex-status unlocked"><Check size={12} /> Unlocked</span>
                      ) : (
                        <span className="catdex-status locked"><Lock size={12} /> Locked</span>
                      )}
                    </div>
                    {isUnlocked ? (
                      <>
                        <span className="catdex-origin">{breed.origin}</span>
                        <p className="catdex-desc">{breed.description}</p>
                      </>
                    ) : (
                      <p className="catdex-desc locked-text">Discover this breed in the feed to unlock its card details!</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
