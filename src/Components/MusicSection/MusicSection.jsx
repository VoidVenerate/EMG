import React, { useState, useEffect } from 'react';
import './MusicSection.css';
import { useNavigate } from 'react-router-dom';

const MusicSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className='music-section'>
      <div className="music-container">
        <div className="music-headset">
          <div className="headset-girl-1">
            <img 
              src={isMobile ? "/production-mobile.png" : "/production.png"} 
              alt="Production" 
              onClick={() => navigate('/confirmspot')}
            />
          </div>
          <div className="headset-girl-2">
            <img 
              src={isMobile ? "/publishing-mobile.png" : "/publishing.png"} 
              alt="Publishing"  
              onClick={() => navigate('/confirmspot')}
            />
          </div>
        </div>
        <div className="music-vinyl-engineering">
          <img 
            src={isMobile ? "/engineering-mobile.png" : "/engineering.png"} 
            alt="Engineering"  
            onClick={() => navigate('/confirmspot')}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicSection;