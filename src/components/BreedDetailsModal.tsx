import React from 'react';
import { X, Globe, Heart, Zap, Award, Users } from 'lucide-react';
import type { BreedInfo } from '../data/videoData';

interface BreedDetailsModalProps {
  breed: BreedInfo;
  onClose: () => void;
}

export const BreedDetailsModal: React.FC<BreedDetailsModalProps> = ({ breed, onClose }) => {
  const renderStars = (value: number) => {
    return (
      <div className="stat-bar-container">
        <div className="stat-bar-fill" style={{ width: `${(value / 5) * 100}%` }}></div>
      </div>
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>{breed.name}</h2>
          {breed.origin && <span className="breed-origin">{breed.origin}</span>}
        </div>

        <div className="modal-body">
          {breed.description && (
            <div className="breed-description-section">
              <h3>About the Breed</h3>
              <p>{breed.description}</p>
            </div>
          )}

          {breed.temperament && (
            <div className="breed-tags-section">
              <h3>Temperament</h3>
              <div className="breed-tags">
                {breed.temperament.split(',').map((t, index) => (
                  <span key={index} className="breed-tag">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="breed-stats-grid">
            {breed.energy_level !== undefined && (
              <div className="breed-stat-row">
                <span className="stat-label">
                  <Zap size={16} className="stat-icon" /> Energy Level
                </span>
                {renderStars(breed.energy_level)}
              </div>
            )}
            {breed.affection_level !== undefined && (
              <div className="breed-stat-row">
                <span className="stat-label">
                  <Heart size={16} className="stat-icon" /> Affection
                </span>
                {renderStars(breed.affection_level)}
              </div>
            )}
            {breed.intelligence !== undefined && (
              <div className="breed-stat-row">
                <span className="stat-label">
                  <Award size={16} className="stat-icon" /> Intelligence
                </span>
                {renderStars(breed.intelligence)}
              </div>
            )}
            {breed.social_needs !== undefined && (
              <div className="breed-stat-row">
                <span className="stat-label">
                  <Users size={16} className="stat-icon" /> Social Needs
                </span>
                {renderStars(breed.social_needs)}
              </div>
            )}
          </div>

          <div className="breed-footer-details">
            {breed.life_span && (
              <div className="footer-detail-item">
                <span className="detail-label">Life Span</span>
                <span className="detail-value">{breed.life_span} years</span>
              </div>
            )}
            {breed.wikipedia_url && (
              <a
                href={breed.wikipedia_url}
                target="_blank"
                rel="noopener noreferrer"
                className="wikipedia-link"
              >
                <Globe size={16} /> Wikipedia Article
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
