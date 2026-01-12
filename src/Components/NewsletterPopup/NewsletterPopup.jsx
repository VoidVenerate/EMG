// NewsletterPopup.jsx
import React, { useState, useEffect } from 'react';
import './NewsletterPopup.css';

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://exodus-va6e.onrender.com/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully subscribed! 🎉');
        setEmail('');
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      } else if (response.status === 400) {
        setError('This email is already subscribed.');
      } else if (response.status === 422) {
        setError('Please enter a valid email address.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to subscribe. Please check your connection.');
      console.error('Subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="newsletter-overlay">
      <div className="newsletter-popup">
        <button className="close-btn" onClick={handleClose}>
          ✕
        </button>
        
        <div className="popup-content">
          <div className="illustration">
            <img 
              src="/popup.png" 
              alt="Newsletter illustration" 
              className="illustration-image"
            />
          </div>
          
          <div className="text-content">
            <h2>Stay Plugged.</h2>
            <p>
              Sign up to our newsletter to discover new artists/music,
              get insider tips on music distribution, and stay ahead
              with exclusive updates.
            </p>
            
            <form onSubmit={handleSubscribe} className="subscribe-pop-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-pop-input"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="subscribe-pop-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;