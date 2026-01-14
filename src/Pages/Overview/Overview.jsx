import React from 'react'
import AdminCards from '../../Components/AdminCards/AdminCards'
import ArtistRequests from '../../Components/ArtistRequests/ArtistRequests'
import './Overview.css'

const Overview = () => {
  return (
    <div className="overview-page">
      <div className="overview-header">
        <h1 className="overview-title">Overview</h1>
        <p className="overview-subtitle">View summary data and manage your artist relationships.</p>
      </div>
      <AdminCards />
      <ArtistRequests />
    </div>
  )
}

export default Overview