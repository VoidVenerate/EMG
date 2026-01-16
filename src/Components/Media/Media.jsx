import React from 'react';

const Media = () => {
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

        /* ===== Media Section ===== */
        .media-section {
          width: 100%;
          padding: 60px 58px;
          background: #0B0B0F;
          color: #fff;
        }

        /* ===== Media Container ===== */
        .media-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: #AC8900;
          border: 1px solid #FFFFFF26;
          border-radius: 48px;
          overflow: hidden;
          max-width: 100%;
          margin: 0 auto;
          padding: 0px;
        }

        /* Mobile replacement image - hidden by default */
        .media-mobile-image {
          display: none;
          width: 100%;
          border-radius: 24px;
          overflow: hidden;
        }

        .media-mobile-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        /* Vector decorations INSIDE container */
        .media-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 660px;
          height: 660px;
          background: url("/Vector.svg") no-repeat;
          background-size: contain;
          opacity: 1;
          pointer-events: none;
        }

        .media-container::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 660px;
          height: 660px;
          background: url("/Vector.svg") no-repeat;
          background-size: contain;
          opacity: 0.25;
          transform: rotate(180deg);
          pointer-events: none;
        }

        /* Keep content above vectors */
        .media-container > * {
          position: relative;
          z-index: 1;
        }

        /* Image side (LEFT on desktop) */
        .media-container-img {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .media-container-img img {
          max-width: 585px;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        /* Text side (RIGHT on desktop) */
        .media-container-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Headline */
        .media-container-text p:first-child {
          font-size: 44px;
          font-weight: 400;
          line-height: 1.45;
          color: #fff;
        }

        /* Subtext */
        .media-container-text p:nth-child(2) {
          font-size: 16px;
          color: #FFFFFFCC;
          line-height: 1.6;
        }

        /* Button */
        .media-container-text button {
          align-self: flex-start;
          padding: 18px 36px;
          font-size: 16px;
          font-weight: 400;
          background: transparent;
          color: #fff;
          border-radius: 4px;
          border: 1px solid #FFFFFF33;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .media-container-text button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #fff;
          transform: translateY(-2px);
        }

        /* ===== Footer ===== */
        .media-footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-top: 4rem;
        }

        .media-footer > p {
          font-size: 44px;
          color: #fff;
        }

        .media-icons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .media-icons img {
          width: 28px;
          height: 28px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .media-icons img:hover {
          transform: scale(1.15);
        }

        /* ===== Responsive ===== */
        @media (max-width: 1024px) {
          .media-section {
            padding: 50px 40px;
          }

          .media-container {
            padding: 35px;
            gap: 2.5rem;
          }

          .media-container-text p:first-child {
            font-size: 36px;
          }

          .media-footer > p {
            font-size: 36px;
          }
        }

        @media (max-width: 900px) {
          .media-container {
            flex-direction: column;
            text-align: center;
            padding: 30px;
          }

          /* Text appears first */
          .media-container-text {
            order: 1;
            align-items: center;
          }

          /* Image appears second */
          .media-container-img {
            order: 2;
          }

          .media-container-text button {
            align-self: center;
          }
        }

        @media (max-width: 768px) {
          .media-section {
            padding: 0px;
          }

          /* Hide the original container on mobile */
          .media-container {
            display: none;
          }

          /* Show the mobile image instead */
          .media-mobile-image {
            display: block;
          }

          .media-footer {
            flex-direction: column;
            gap: 2rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            text-align: center;
            align-items: baseline;
            padding-left: 24px;
          }

          .media-footer > p {
            font-size: 28px;
            margin-bottom: 0;
          }

          .media-icons {
            gap: 2rem;
          }

          .media-icons img {
            width: 32px;
            height: 32px;
          }
        }

        @media (max-width: 480px) {
          .media-section {
            padding: 0px;
          }

          .media-mobile-image {
            border-radius: 0px;
          }

          .media-footer > p {
            font-size: 22px;
            line-height: 1.3;
          }

          .media-icons {
            gap: 1.5rem;
          }

          .media-icons img {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>

      <div className='media-section'>
        {/* Desktop/Tablet Container */}
        <div className="media-container">
          <div className="media-container-img">
            <img src="/Man-hs.png" alt="Artist with headphones" />
          </div>
          <div className="media-container-text">
            <p>Reach More Fans. <br />
              Grow Your Music Career.</p>
            <p>Reach new listeners and elevate your music career with ease</p>
            <button>Join Us Today!</button>
          </div>
        </div>

        {/* Mobile Image Replacement */}
        <div className="media-mobile-image">
          <img src="/mobile-media-banner.png" alt="Join us today" />
        </div>

        <div className="media-footer">
          <p style={{fontFamily:'Nimous-Daven'}}>Follow us on social media</p>
          <div className="media-icons">
            <img src="/Instagram.png" alt="Instagram" />
            <img src="/Tiktok.png" alt="TikTok" />
            <img src="/Twitter.png" alt="Twitter" />
            <img src="/Facebook.png" alt="Facebook" />
            <img src="/Youtube.png" alt="YouTube" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Media;