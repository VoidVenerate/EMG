import React from 'react'
import AdminCards from '../../Components/AdminCards/AdminCards'
import ArtistRequests from '../../Components/ArtistRequests/ArtistRequests'

const Overview = () => {
  return (
    <div className="overview-page" style={{padding:'16px 24px'}}>
        <p style={{fontSize:'36px', color:"#fff", fontWeight:"600", marginLeft:'5vw', fontFamily:"DM Sans"}}>Overview</p>
        <p style={{fontSize:'16px', color:'#FFFFFFB2', marginLeft:'5vw', fontFamily:"DM Sans"}}>View summary data and manage your artist relationships.</p>
        <AdminCards />
        <ArtistRequests />
    </div>
  )
}

export default Overview