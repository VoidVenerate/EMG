import React from 'react';
import './MusicSection.css';

const MusicSection = () => {
  return (
    <div className='music-section'>
      <div className="music-container">
        <div className="music-headset">
          <div className="headset-girl-1">
            <img src="/production.png" alt="Production" />
          </div>
          <div className="headset-girl-2">
            <img src="/publishing.png" alt="Publishing" />
          </div>
        </div>
        <div className="music-vinyl-engineering">
          <img src="/engineering.png" alt="Engineering" />
        </div>
      </div>
    </div>
  );
};

export default MusicSection;