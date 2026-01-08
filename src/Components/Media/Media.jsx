import React from 'react'
import './Media.css'

const Media = () => {
  return (
    <div className='media-section'>
        <div className="media-container">
            <div className="media-container-img">
                <img src="/Man-hs.png" alt="" />
            </div>
            <div className="media-container-text">
                <p>Reach More Fans. <br />
                    Grow Your Music Career.</p>
                <p>Reach new listeners and elevate your music career with ease</p>
                <button>Join Us Today!</button>
            </div>
        </div>
        <div className="media-footer">
            <p style={{fontFamily:'Nimous-Daven'}}>Follow us on social media</p>
            <div className="media-icons">
                <img src="/Instagram.png" alt="" />
                <img src="/Tiktok.png" alt="" />
                <img src="/Twitter.png" alt="" />
                <img src="/Facebook.png" alt="" />
                <img src="/Youtube.png" alt="" />
            </div>
        </div>
    </div>
  )
}

export default Media