import React from 'react'
import './IL.css'

const IL = () => {
  return (
    <div className='IL-section'>
        <div className="IL-container">
            <p className="IL-header">
                Independent and Limitless.
            </p>
            <p className="IL-normal-font">
                We measure impact in energy, not just numbers but here's how far the movement's already gone
            </p>
            <div className="IL-reviews">
                <div className="review-nimous">
                    <p style={{fontFamily: 'Nimous-Daven', fontSize:'96px'}}>100%</p>
                    <p style={{fontFamily:'DM Sans', fontSize:'36px', lineHeight:'64px'}}>Creative freedom</p>
                </div>
                <div className="review-nimous">
                    <p style={{fontFamily: 'Nimous-Daven', fontSize:'96px'}}>250M+</p>
                    <p style={{fontFamily:'DM Sans', fontSize:'36px', lineHeight:'64px'}}>Global streams</p>
                </div>
                <div className="review-nimous">
                    <p style={{fontFamily: 'Nimous-Daven', fontSize:'96px'}}>1K+</p>
                    <p style={{fontFamily:'DM Sans', fontSize:'36px', lineHeight:'64px'}}>5-star reviews</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default IL