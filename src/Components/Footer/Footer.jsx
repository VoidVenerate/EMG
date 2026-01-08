import React, { useState } from 'react'
import './Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    // Basic email validation
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('https://exodus-va6e.onrender.com/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Successfully subscribed! Check your inbox.' 
        })
        setEmail('') // Clear the input
      } else if (response.status === 400) {
        setStatus({ 
          type: 'error', 
          message: 'This email is already subscribed.' 
        })
      } else {
        setStatus({ 
          type: 'error', 
          message: 'Something went wrong. Please try again.' 
        })
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className='footer-section'>
        <div className="footer-container">
            <div className="footer-logo">
                <img src="/emg-logo-dark.png" alt="" />
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
  )
}

export default Footer