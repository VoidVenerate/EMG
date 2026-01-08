import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import './ArtistRequests.css'
import { BookCopy, SquareCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const copyToClipboard = (value) => {
  navigator.clipboard.writeText(value)
  toast.success('Copied to clipboard!')
}

const ArtistCard = ({ artist, onApprove, onDelete }) => (
  <div className="artist-requests-card">

    {/* ARTIST INFO - 2 Column Grid */}
    <div className="artist-info-grid">
      <div className="artist-field">
        <label>Artist Name</label>
        <p>{artist.artist_name}</p>
      </div>

      <div className="artist-field">
        <label>Email</label>
        <p>{artist.email}</p>
      </div>
    </div>

    {/* LINKS - 2 Column Grid */}
    <div className="social-links">
      {artist.ig_link && (
        <div className="link-item">
          <label>Instagram Link</label>
          <div className="link-content">
            <span>{artist.ig_link}</span>
            <BookCopy onClick={() => copyToClipboard(artist.ig_link)} />
          </div>
        </div>
      )}

      {artist.yt_link && (
        <div className="link-item">
          <label>YouTube Link</label>
          <div className="link-content">
            <span>{artist.yt_link}</span>
            <BookCopy onClick={() => copyToClipboard(artist.yt_link)} />
          </div>
        </div>
      )}

      {artist.spotify_link && (
        <div className="link-item">
          <label>Spotify Profile Link</label>
          <div className="link-content">
            <span>{artist.spotify_link}</span>
            <BookCopy onClick={() => copyToClipboard(artist.spotify_link)} />
          </div>
        </div>
      )}

      {artist.apple_music_link && (
        <div className="link-item">
          <label>Apple Music Link</label>
          <div className="link-content">
            <span>{artist.apple_music_link}</span>
            <BookCopy onClick={() => copyToClipboard(artist.apple_music_link)} />
          </div>
        </div>
      )}
    </div>

    {/* SERVICES - 2 Column Grid */}
    <div className="services">
      {artist.music_distribution && (
        <span><SquareCheck /> Music Distribution</span>
      )}
      {artist.music_publishing && (
        <span><SquareCheck /> Music Publishing</span>
      )}
      {artist.prod_and_engineering && (
        <span><SquareCheck /> Production & Engineering</span>
      )}
      {artist.marketing_and_promotions && (
        <span><SquareCheck /> Marketing & Promotions</span>
      )}
    </div>

    {/* STATUS */}
    <span className={`status ${artist.status}`}>{artist.status}</span>

    <p className="date">
      Requested on: {new Date(artist.created_at).toLocaleDateString()}
    </p>

    {/* ACTIONS */}
    <div className="artist-card-actions">
      {artist.status !== "approved" && (
        <button className="approve-btn" onClick={() => onApprove(artist.id)}>
          Add to List
        </button>
      )}
      <button className="delete-request-btn" onClick={() => onDelete(artist.id)}>
        Remove Request
      </button>
    </div>

  </div>
)



const ArtistRequests = () => {

    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const requestsPerPage = 4

    const startIndex = currentPage * requestsPerPage
    const endIndex = startIndex + requestsPerPage
    const currentRequests = requests.slice(startIndex, endIndex)
    const pageCount = Math.ceil(requests.length / requestsPerPage)

    const token = localStorage.getItem('token')
    const headers = {   
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    }

    const fetchRequests = async () => {
        try {
            setLoading(true)
            if(!token) return

            const requestRes = await axios.get('https://exodus-va6e.onrender.com/artist-requests/admin-list', { headers })
            setRequests(requestRes.data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching artist requests:', err)
            setError('Failed to load artist requests.')
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchRequests()
    }, [])

    const handleApprove = async (id) => {
      try {
        await axios.put(`https://exodus-va6e.onrender.com/artist-requests/${id}/approve`, {}, { headers })
        setRequests(prev =>
          prev.map(r => (r.id === id ? { ...r, status: 'approved' } : r))
        )
        toast.success('Artist approved!')
      } catch (err) {
        console.error(err)
        toast.error('Failed to approve request.')
      }
    }

    const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this request?')) return

      try {
        await axios.delete(`https://exodus-va6e.onrender.com//artist-requests/admin-remove-request/${request_id}`, { headers })
        setRequests(prev => prev.filter(r => r.id !== id))
        toast.success('Request deleted!')
      } catch (err) {
        console.error(err)
        toast.error('Failed to delete request.')
      }
    }

    const handlePageClick = (event) => {
      setCurrentPage(event.selected)
    }

  return (
    <div className="artistRequests-section">
      <div className="section-section">
        <h2>Artist Requests</h2>
        <p>Manage incoming artist requests and add them to your roster.</p>
      </div>
      <div className="section-list-button">
        View List
      </div>

      {loading && <p>Loading requests...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p>No artist requests at the moment.</p>
      )}

      <div className="artist-card-grid">
        {currentRequests.map(artist => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {requests.length > requestsPerPage && (
        <ReactPaginate
          previousLabel={'← Previous'}
          nextLabel={'Next →'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          disabledClassName={'disabled'}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
        />
      )}
    </div>
  )
}

export default ArtistRequests