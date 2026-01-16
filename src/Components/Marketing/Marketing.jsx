import React from 'react';

const Marketing = () => {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #0B0B0F;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ===== Marketing Section ===== */
        .marketing-section {
          width: 100%;
          padding: 60px 58px;
          background: #0B0B0F;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
        }

        /* Header */
        .marketing-header {
          text-align: center;
          max-width: 900px;
        }

        .marketing-header p:first-child {
          font-size: 20px;
          font-weight: 400;
          margin-bottom: 1rem;
          color: #fff;
        }

        .marketing-header p:last-child {
          font-size: 30px;
          color: #ccc;
          line-height: 1.8;
          font-weight: 400;
        }

        /* Horizontal icons list */
        .horizontal-list {
          display: flex;
          flex-wrap: wrap;
          gap: 2.5rem;
          justify-content: space-between;
          width: 100%;
          max-width: 1200px;
        }

        .icons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        /* Circular background for icon images only */
        .icons img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          background: #FFFFFF0D;
          border-radius: 50%;
          padding: 15px;
          transition: all 0.3s ease;
          border: 1px solid #FFFFFF33;
        }

        .icons:hover img {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        /* Icon text below circle */
        .icons p {
          text-align: center;
          font-size: 1rem;
          font-weight: 500;
          color: #fff;
          margin-top: 0.5rem;
        }

        /* Button */
        .marketing-section > button {
          padding: 16px 40px;
          font-size: 1.125rem;
          font-weight: 600;
          background-color: #272728;
          color: #fff;
          border: 1px solid #676767;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .marketing-section > button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(172, 137, 0, 0.2);
        }

        /* ===== Responsive ===== */
        @media (max-width: 1024px) {
          .marketing-section {
            padding: 50px 40px;
            gap: 2.5rem;
          }

          .marketing-header p:last-child {
            font-size: 26px;
          }
        }

        @media (max-width: 768px) {
          .marketing-section {
            padding: 40px 24px;
            gap: 2rem;
          }

          .marketing-header {
            text-align: center;
          }

          .marketing-header p:first-child {
            font-size: 26px;
          }

          .marketing-header p:last-child {
            font-size: 22px;
            line-height: 1.6;
          }

          .horizontal-list {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            row-gap: 2rem;
          }

          .icons img {
            width: 50px;
            height: 50px;
            padding: 12px;
          }

          .icons p {
            font-size: 0.875rem;
          }

          .marketing-section > button {
            padding: 14px 32px;
            font-size: 1rem;
            width: 100%;
            max-width: 253px;
          }
        }

        @media (max-width: 480px) {
          .marketing-section {
            padding: 32px 20px;
            gap: 1.75rem;
          }

          .marketing-header p:first-child {
            font-size: 20px;
          }

          .marketing-header p:last-child {
            font-size: 18px;
          }

          .horizontal-list {
            gap: 1.25rem;
            row-gap: 1.75rem;
          }

          .icons img {
            width: 45px;
            height: 45px;
            padding: 10px;
          }

          .icons p {
            font-size: 0.8rem;
          }

          .marketing-section > button {
            padding: 12px 28px;
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className='marketing-section'>
        <div className="marketing-header">
          <p>Music Marketing</p>
        </div>
        <div className="horizontal-list">
          <div className="icons">
            <img src="/headphone.png" alt="headphone" />
            <p>Playlist Pitching</p>
          </div>
          <div className="icons">
            <img src="/laptop.png" alt="laptop" />
            <p>Digital Strategy</p>
          </div>
          <div className="icons">
            <img src="/press.png" alt="press" />
            <p>PR & Press</p>
          </div>
          <div className="icons">
            <img src="/rocket.png" alt="rocket" />
            <p>Artist Marketing</p>
          </div>
          <div className="icons">
            <img src="/paint.png" alt="paint" />
            <p>Creative Support</p>
          </div>
          <div className="icons">
            <img src="/CD.png" alt="cd" />
            <p>Digital & Physical <br /> Distribution</p>
          </div>
        </div>
        <button>Confirm Your Spot Today</button>
      </div>
    </>
  );
};

export default Marketing;