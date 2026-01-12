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
                    <p style={{fontFamily: 'Nimous-Daven'}}>100%</p>
                    <p style={{fontFamily:'DM Sans'}}>Creative freedom</p>
                </div>
                <div className="review-nimous">
                    <p style={{fontFamily: 'Nimous-Daven'}}>250M+</p>
                    <p style={{fontFamily:'DM Sans'}}>Global streams</p>
                </div>
                <div className="review-nimous">
                    <p style={{fontFamily: 'Nimous-Daven'}}>1K+</p>
                    <p style={{fontFamily:'DM Sans'}}>5-star reviews</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default IL