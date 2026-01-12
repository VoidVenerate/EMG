import React from 'react'
import './Indie.css'

const Indie = () => {
  return (
    <div className='indie-section'>
        <div className="indie-left">
            <p className="indie-header">
                Built for Indie Artists
            </p>
            <p className='indie-normal-font'>Exodus Music Group isn't a label in the traditional sense, it's a creative uprising. <br />
            Here, artists don't just release songs, they build worlds. Our sound is intentional. <br />
            Our culture is electric. And our mission? To make music that moves hearts and shifts culture for real.</p>
        </div>
        <div className="indie-right">
            <img src="/Contents.png" alt="Contents" />
        </div>
    </div>
  )
}

export default Indie