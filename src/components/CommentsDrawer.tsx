import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface CommentsDrawerProps {
  itemId: string;
  onClose: () => void;
}

const defaultComments: Record<string, Comment[]> = {
  v1: [
    { id: '1', username: 'caturday_fun', text: 'Peak belly rub trap! Don\'t fall for it! 😹', timestamp: '2h ago' },
    { id: '2', username: 'laser_chaser', text: 'Look at those back paws kicking! So cute.', timestamp: '1h ago' }
  ],
  v2: [
    { id: '1', username: 'sleepy_kitten', text: 'Maximum cozy. I need that cushion.', timestamp: '5h ago' },
    { id: '2', username: 'royal_floof', text: 'All hail the sleepy king! 👑💤', timestamp: '3h ago' }
  ],
  v3: [
    { id: '1', username: 'claw_and_order', text: 'Meticulous groomer! Excellent form.', timestamp: '4h ago' },
    { id: '2', username: 'bath_time_hater', text: 'At least this cat grooms itself willingly. Mine needs a bath suit.', timestamp: '2h ago' }
  ]
};

const mockUsernames = ['tabby_cats', 'catnip_addict', 'purr_factory', 'whisker_world', 'meow_mix'];
const mockPhrases = [
  'Absolutely precious! 💖',
  'Peak cat business right here.',
  'Need a 10-hour loop of this, please!',
  'The wiggle right before is the best part 😭',
  '10/10 loaf form.',
  'Wait for it... meow! 🐾',
  'Living rent-free in my head.'
];

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ itemId, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const listEndRef = useRef<HTMLDivElement>(null);

  // Load comments from localStorage or initialize defaults
  useEffect(() => {
    const cleanId = itemId.split('_')[0];
    const saved = localStorage.getItem(`comments_${cleanId}`);
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      // Create some custom seed comments for Cat API random images
      const seeds = defaultComments[cleanId] || [
        {
          id: 's1',
          username: mockUsernames[Math.floor(Math.random() * mockUsernames.length)],
          text: mockPhrases[Math.floor(Math.random() * mockPhrases.length)],
          timestamp: '1h ago'
        },
        {
          id: 's2',
          username: mockUsernames[Math.floor(Math.random() * mockUsernames.length)],
          text: mockPhrases[Math.floor(Math.random() * mockPhrases.length)],
          timestamp: '30m ago'
        }
      ];
      setComments(seeds);
      localStorage.setItem(`comments_${cleanId}`, JSON.stringify(seeds));
    }
  }, [itemId]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      username: 'you_meow',
      text: newCommentText.trim(),
      timestamp: 'Just now'
    };

    const updated = [...comments, newComment];
    setComments(updated);
    
    const cleanId = itemId.split('_')[0];
    localStorage.setItem(`comments_${cleanId}`, JSON.stringify(updated));
    setNewCommentText('');
  };

  return (
    <div className="comments-backdrop" onClick={onClose}>
      <div className="comments-content" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <h3>Comments ({comments.length})</h3>
          <button className="comments-close-btn" onClick={onClose} aria-label="Close comments">
            <X size={20} />
          </button>
        </div>

        <div className="comments-body">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                {comment.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="comment-details">
                <div className="comment-user-row">
                  <span className="comment-username">@{comment.username}</span>
                  <span className="comment-time">{comment.timestamp}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))}
          <div ref={listEndRef} />
        </div>

        <form onSubmit={handlePostComment} className="comments-footer">
          <input
            type="text"
            placeholder="Add a funny comment... 🐾"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="comment-input"
          />
          <button type="submit" className="comment-submit-btn" aria-label="Post comment">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
