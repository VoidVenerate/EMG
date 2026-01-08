import React from 'react'
import './Footer.css'

const Footer = () => {
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
                <form>
                    <input type="text" placeholder='Enter your email' />
                    <button>Subscribe</button>
                </form>
            </div>
        </div>
        <div className="footer-copyright">
            <p>&copy; Copyright 2025, All Rights Reserved by Exodus Music Group</p>
        </div>
    </div>
  )
}

export default Footer