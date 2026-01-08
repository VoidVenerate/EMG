import React, { useState, useEffect } from 'react'
import { UserMinus, Users, Mail } from 'lucide-react'
import './AdminCards.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const BASE_URL = 'https://exodus-va6e.onrender.com'

const AdminCards = () => {
  const [artistRequest, setArtistRequest] = useState(0)
  const [artistCount, setArtistCount] = useState(0)
  const [subscribers, setSubscribers] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const artistRequestRes = await axios.get(
          `${BASE_URL}/artist-requests/admin-list`,
          { headers }
        )
        setArtistRequest(artistRequestRes.data.length)

        const artistsRes = await axios.get(
          `${BASE_URL}/artists`,
          { headers }
        )
        setArtistCount(artistsRes.data.meta.total)

        const subscribersRes = await axios.get(
          `${BASE_URL}/newsletter/subscriptions`,
          { headers }
        )
        setSubscribers(subscribersRes.data.length)

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchData()
  }, [])

  // ===== DOWNLOAD NEWSLETTER REPORT =====
  const downloadSubscribersReport = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await axios.get(
        `${BASE_URL}/newsletter/subscriptions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const data = res.data || []

      if (data.length === 0) {
        alert('No subscribers available to export.')
        return
      }

      const formattedData = data.map(sub => ({
        Email: sub.email,
        Subscribed_At: new Date(sub.subscribed_at).toLocaleString(),
      }))

      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscribers')

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      const file = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      })

      saveAs(file, 'newsletter_subscribers.xlsx')

    } catch (error) {
      console.error('Failed to download subscribers report:', error)
      alert('Failed to download report.')
    }
  }

  return (
    <div className="dashboard-cards">

      {/* ===== Artist Requests ===== */}
      <div className="dashboard-card">
        <div className="card-icon">
          <UserMinus size={24} />
        </div>
        <h3>Artist Requests</h3>
        <p>{artistRequest}</p>
        <span className="hr-span"></span>
        <button>View List</button>
      </div>

      {/* ===== Artists Count ===== */}
      <div className="dashboard-card">
        <div className="card-icon">
          <Users size={24} />
        </div>
        <h3>Artists Count</h3>
        <p>{artistCount}</p>
        <span className="hr-span"></span>
        <button onClick={() => navigate('/addartist')}>
          Add Artist
        </button>
      </div>

      {/* ===== Newsletter Subscribers ===== */}
      <div className="dashboard-card">
        <div className="card-icon">
          <Mail size={24} />
        </div>
        <h3>Newsletter Subscribers</h3>
        <p>{subscribers}</p>
        <span className="hr-span"></span>
        <button onClick={downloadSubscribersReport}>
          Download Report
        </button>
      </div>

    </div>
  )
}

export default AdminCards
