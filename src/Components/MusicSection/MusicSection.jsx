import React from 'react'
import './MusicSection.css'

const MusicSection = () => {
  return (
    <div className='music-section'>
        <div className="music-container">
            <div className="music-headset">
                <div className="headset-girl-1">
                    <img src="/production.png" alt="" />
                </div>
                <div className="headset-girl-2">
                    <img src="/publishing.png" alt="" />
                </div>
            </div>
            <div className="music-vinyl-engineering">
                <img src="/engineering.png" alt="" />
            </div>
        </div>
    </div>
  )
}

export default MusicSection