import React from 'react'
import './Marketing.css'

const Marketing = () => {
  return (
    <div className='marketing-section'>
        <div className="marketing-header">
            <p>Music Marketing</p>
            <p> A track without Exodus is a potential hit with no plan. <br />
                We make sure people actually hear it.</p>
        </div>
        <div className="horizontal-list">
            <div className="icons">
                <img src="/headphone.png" alt="headphone" />
                <p>Playlist Pitching</p>
            </div>
            <div className="icons">
                <img src="/laptop.png" alt="headphone" />
                <p>Digital Strategy </p>
            </div>
            <div className="icons">
                <img src="/press.png" alt="press" />
                <p>PR & Press</p>
            </div>
            <div className="icons">
                <img src="/rocket.png" alt="rocket" />
                <p>Artist Marketing </p>
            </div>
            <div className="icons">
                <img src="/paint.png" alt="paint" />
                <p>Creative Support</p>
            </div>
            <div className="icons">
                <img src="/CD.png" alt="cd" />
                <p>Digital & Physical Distribution </p>
            </div>
        </div>
        <button>Confirm Your Spot Today</button>
    </div>
  )
}

export default Marketing