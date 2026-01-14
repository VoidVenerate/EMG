import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://exodus-va6e.onrender.com/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Successfully subscribed! Check your inbox.' 
        });
        setEmail('');
      } else if (response.status === 400) {
        setStatus({ 
          type: 'error', 
          message: 'This email is already subscribed.' 
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className='footer-section'>
      <style>{`
        /* ===== Footer Section ===== */
        .footer-section {
          width: 100%;
          background: #ffffff;
          color: #0b0b0f;
          font-family: 'DM Sans', sans-serif;
          padding: 4rem 5vw 2rem;
          box-sizing: border-box;
        }

        /* Container */
        .footer-container {
          display: flex;
          flex-wrap: wrap;
          gap: 3rem;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
        }

        /* ===== Logo ===== */
        .footer-logo {
          align-self: flex-start;
          margin-top:-60px;
        }

        .footer-logo img {
          width: 160px;
        }

        /* ===== Info Columns ===== */
        .info {
          display: flex;
          gap: 4rem;
          align-items: flex-start;
        }

        .info > div {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          line-height: 24px;
        }

        .info p {
          font-size: 16px;
          font-weight: 500;
          color: #000;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .info p:hover {
          color: #AC8900;
        }

        /* ===== Subscribe Section ===== */
        .footer-subscribe {
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-self: flex-start;
        }

        .footer-subscribe p:first-child {
          font-size: 30px;
          font-weight: 600;
          color: #000000;
        }

        .footer-subscribe p:nth-child(2) {
          font-size: 14px;
          color: #000;
          line-height: 1.6;
        }

        /* Form */
        .subscribe-form {
          display: flex;
          gap: 4px;
          margin-top: 0.5rem;
        }

        .subscribe-form input {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 0.95rem;
          outline: none;
        }

        .subscribe-form input:focus {
          border-color: #000;
        }

        .subscribe-form input:disabled,
        .subscribe-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .subscribe-form button {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: none;
          background: #AC8900;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .subscribe-form button:hover:not(:disabled) {
          background: #bc9809;
        }

        /* Status Messages */
        .subscribe-message {
          font-size: 14px;
          font-weight: 500;
          margin-top: 0.75rem;
          padding: 0.5rem;
          border-radius: 6px;
        }

        .subscribe-message.success {
          color: #4CAF50;
          background: #f1f8f4;
        }

        .subscribe-message.error {
          color: #f44336;
          background: #fef1f0;
        }

        /* ===== Copyright ===== */
        .footer-copyright {
          border-top: 1px solid #e5e5e5;
          padding-top: 1.5rem;
          text-align: center;
        }

        .footer-copyright p {
          font-size: 0.85rem;
          color: #666;
        }

        /* ===== Tablet Responsive (1024px and below) ===== */
        @media (max-width: 1024px) {
          .footer-section {
            padding: 3rem 4vw 2rem;
          }

          .footer-container {
            flex-direction: column;
            gap: 2.5rem;
          }

          .info {
            gap: 2.5rem;
          }

          .footer-subscribe {
            max-width: 100%;
          }
        }

        /* ===== Mobile Responsive (768px and below) ===== */
        @media (max-width: 768px) {
          .footer-container {
            gap: 2rem;
          }

          .footer-logo {
            width: 100%;
          }

          .footer-logo img {
            width: 140px;
          }

          .info {
            gap: 2rem 1.5rem;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .info > div {
            gap: 0.5rem;
          }

          .info p {
            font-size: 14px;
          }

          .footer-subscribe p:first-child {
            font-size: 24px;
          }

          .footer-subscribe p:nth-child(2) {
            font-size: 13px;
          }

          .subscribe-form {
            flex-direction: row;
            gap: 0.5rem;
          }

          .subscribe-form input {
            flex: 1;
            padding: 0.85rem 1rem;
          }

          .subscribe-form button {
            padding: 0.85rem 1rem;
            flex-shrink: 0;
          }

          .footer-copyright p {
            font-size: 0.8rem;
            line-height: 1.5;
          }
        }

        /* ===== Small Mobile (480px and below) ===== */
        @media (max-width: 480px) {
          .footer-section {
            padding: 2rem 4vw 1.5rem;
          }

          .footer-container {
            gap: 1.5rem;
          }

          .footer-logo {
            margin-top: -60px;
          }

          .footer-logo img {
            width: 120px;
          }

          .info {
            grid-template-columns: repeat(1,1fr);
            gap: 0rem;
            padding-left: 20px;
          }
          .footer-subscribe {
            padding-left: 20px;
          }

          .info > div {
            width: 100%;
          }

          .info p {
            font-size: 14px;
          }

          .footer-subscribe p:first-child {
            font-size: 20px;
          }

          .footer-subscribe p:nth-child(2) {
            font-size: 12px;
          }

          .subscribe-form input {
            flex: 1;
            padding: 0.75rem 0.85rem;
            font-size: 0.9rem;
          }

          .subscribe-form button {
            padding: 0.75rem 0.85rem;
            font-size: 0.9rem;
            flex-shrink: 0;
          }

          .subscribe-message {
            font-size: 12px;
          }

          .footer-copyright p {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <div className="footer-container">
        <div className="footer-logo">
          <img src="/emg-logo-dark.png" alt="Exodus Music Group" />
        </div>
        <div className="info">
          <div className="menu">
            <p>Home</p>
            <p>Roster</p>
            <p>New Music</p>
          </div>
          <div className="media">
            <p>Instagram</p>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Youtube</p>
            <p>Tiktok</p>
          </div>
          <div className="others">
            <p>FAQs</p>
            <p>Privacy Policy</p>
            <p>Terms and Conditions</p>
          </div>
        </div>
        <div className="footer-subscribe">
          <p>Stay Plugged.</p>
          <p>Sign up to our newsletter to discover new artists/music, get insider tips on music distribution, and stay ahead with exclusive updates.</p>
          <div className="subscribe-form">
            <input 
              type="email" 
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {status.message && (
            <p className={`subscribe-message ${status.type}`}>
              {status.message}
            </p>
          )}
        </div>
      </div>
      <div className="footer-copyright">
        <p>&copy; Copyright 2025, All Rights Reserved by Exodus Music Group</p>
      </div>
    </div>
  );
};

export default Footer;