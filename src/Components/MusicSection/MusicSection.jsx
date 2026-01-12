import React from 'react';

const MusicSection = () => {
  return (
    <div className='music-section'>
      <style>{`
        /* ===== Music Section ===== */
        .music-section {
          width: 100vw;
          padding: 24px 44px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
          background: #0a0a0a;
        }

        .music-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1420px;
          margin: 0 auto;
        }

        /* ===== Headset Section ===== */
        .music-headset {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .headset-girl-1,
        .headset-girl-2 {
          width: 100%;
          overflow: hidden;
          border-radius: 8px;
        }

        .headset-girl-1 img,
        .headset-girl-2 img {
          width: 100%;
          height: 641px;
          object-fit: cover;
          display: block;
        }

        /* ===== Vinyl Engineering Section ===== */
        .music-vinyl-engineering {
          width: 100%;
          overflow: hidden;
          border-radius: 8px;
        }

        .music-vinyl-engineering img {
          width: 100%;
          height: auto;
          min-height: 336px;
          object-fit: cover;
          display: block;
        }

        /* ===== Tablet Responsive (1024px and below) ===== */
        @media (max-width: 1024px) {
          .music-section {
            padding: 24px 32px;
          }

          .headset-girl-1 img,
          .headset-girl-2 img {
            height: 500px;
          }

          .music-vinyl-engineering img {
            min-height: 280px;
          }
        }

        /* ===== Mobile Responsive (768px and below) ===== */
        @media (max-width: 768px) {
          .music-section {
            height: auto;
            padding: 20px 16px;
          }

          .music-container {
            gap: 1.5rem;
          }

          .music-headset {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .headset-girl-1 img,
          .headset-girl-2 img {
            height: auto;
            object-fit: contain;
            width: 100%;
          }

          .music-vinyl-engineering img {
            min-height: auto;
            object-fit: contain;
            width: 100%;
          }
        }

        /* ===== Small Mobile (480px and below) ===== */
        @media (max-width: 480px) {
          .music-section {
            padding: 16px 24px;
          }

          .music-container {
            gap: 1rem;
          }

          .music-headset {
            gap: 1rem;
          }
          
        }
      `}</style>

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