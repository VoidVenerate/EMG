import React from 'react'
import './MusicSection.css'

const MusicSection = () => {
  return (
    <div className='music-section'>
        <div className="music-container">
            <div className="music-headset">
                <div className="headset-1">
                    <p className='header'>Music <br /> Distribution</p>
                    <p className='normal-music-font'>Get your music everywhere it should be heard.</p>
                    <button>Go Global</button>
                    <img src="/Image.png" alt="Girl wearing an headset" />
                </div>
                <div className="headset-2">
                    <p className='header'>Music <br /> Publishing</p>
                    <p className='normal-music-font'>We make sure the world pays attention and pays you.</p>
                    <button>Own Your Work</button>
                    <img src="/image 2.png" alt="Girl with blue hair wearing an headset" />
                </div>
            </div>
            <div className="music-vinyl">
                <div className="vinyl-left">
                    <img src="/vinyl-records.png" alt="Vinyl-records" />
                </div>
                <div className="vinyl-right">
                    <p className="header">Production & <br /> Engineering</p>
                    <p className="normal-music-font">Every sound deserves precision.</p>
                    <button>Sound Like a Pro</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MusicSection