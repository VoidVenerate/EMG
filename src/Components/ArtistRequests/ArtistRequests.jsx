import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import './ArtistRequests.css'
import { BookCopy, SquareCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../Modal/Modal'
import { useNavigate } from 'react-router-dom'

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
      <span className={artist.music_distribution ? 'checked' : 'unchecked'}>
        <SquareCheck /> Music Distribution
      </span>
      <span className={artist.music_publishing ? 'checked' : 'unchecked'}>
        <SquareCheck /> Music Publishing
      </span>
      <span className={artist.prod_and_engineering ? 'checked' : 'unchecked'}>
        <SquareCheck /> Production & Engineering
      </span>
      <span className={artist.marketing_and_promotions ? 'checked' : 'unchecked'}>
        <SquareCheck /> Marketing & Promotions
      </span>
    </div>
    
    <p className="date">
      Requested on: {new Date(artist.created_at).toLocaleDateString()}
    </p>

    {/* ACTIONS */}
    <div className="artist-card-actions">
      {artist.status !== "listed" && (
        <button className="approve-btn" onClick={() => onApprove(artist.id, artist.artist_name)}>
          Add to List
        </button>
      )}
      <button className="delete-request-btn" onClick={() => onDelete(artist.id, artist.artist_name)}>
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
    const navigate = useNavigate()

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('success')
    const [modalTitle, setModalTitle] = useState('')
    const [modalMessage, setModalMessage] = useState('')
    const [modalSubMessage, setModalSubMessage] = useState('')
    const [modalAction, setModalAction] = useState(null)

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
            // Filter out artists with "listed" status
            const pendingRequests = requestRes.data.filter(artist => artist.status !== 'listed')
            setRequests(pendingRequests)
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

    // Modal helper functions
    const showSuccessModal = (title, message, subMessage = '') => {
      setModalType('success')
      setModalTitle(title)
      setModalMessage(message)
      setModalSubMessage(subMessage)
      setModalAction(null)
      setShowModal(true)
    }

    const showErrorModal = (title, message, subMessage = '') => {
      setModalType('error')
      setModalTitle(title)
      setModalMessage(message)
      setModalSubMessage(subMessage)
      setModalAction(null)
      setShowModal(true)
    }

    const showConfirmModal = (title, message, subMessage, onConfirm) => {
      setModalType('duration')
      setModalTitle(title)
      setModalMessage(message)
      setModalSubMessage(subMessage)
      setModalAction(() => onConfirm)
      setShowModal(true)
    }

    const handleCloseModal = () => {
      setShowModal(false)
      setModalAction(null)
    }

    const handleConfirmAction = () => {
      if (modalAction) {
        modalAction()
      }
      handleCloseModal()
    }

    const handleApprove = async (id, artistName) => {
      showConfirmModal(
        'Add Artist to List',
        `Are you sure you want to add ${artistName} to the list?`,
        'This will set the artist status to "listed".',
        async () => {
          try {
            await axios.patch(
              `https://exodus-va6e.onrender.com/artist-requests/admin-update-status/${id}`,
              { status: 'listed' },
              { headers }
            )
            // Remove the artist from the requests list since they're now listed
            setRequests(prev => prev.filter(r => r.id !== id))
            showSuccessModal(
              'Artist Added!',
              `${artistName} has been successfully added to the list.`,
              'The artist will now appear in your listed artists.'
            )
          } catch (err) {
            console.error(err)
            showErrorModal(
              'Action Failed',
              `Failed to add ${artistName} to the list.`,
              'Please try again or contact support if the issue persists.'
            )
          }
        }
      )
    }

    const handleDelete = async (id, artistName) => {
      showConfirmModal(
        'Delete Artist Request',
        `Are you sure you want to delete ${artistName}'s request?`,
        'This action cannot be undone.',
        async () => {
          try {
            await axios.delete(`https://exodus-va6e.onrender.com/artist-requests/admin-remove-request/${id}`, { headers })
            setRequests(prev => prev.filter(r => r.id !== id))
            showSuccessModal(
              'Request Deleted!',
              `${artistName}'s request has been removed.`,
              'The request has been permanently deleted from the system.'
            )
          } catch (err) {
            console.error(err)
            showErrorModal(
              'Deletion Failed',
              `Failed to delete ${artistName}'s request.`,
              'Please try again or contact support if the issue persists.'
            )
          }
        }
      )
    }

    const handlePageClick = (event) => {
      setCurrentPage(event.selected)
    }

  return (
    <div className="admin-artistRequests-section">
      <div className="artist-header-section">
        <div className="section-section">
          <h2>Artist Requests</h2>
          <p>Manage incoming artist requests and add them to your roster.</p>
        </div>
        <div className="section-list-button" onClick={() => navigate('/list')} >
          View List
        </div>
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
          breakLabel={null}
        />
      )}

      {/* Modal Component */}
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
        subMessage={modalSubMessage}
        type={modalType}
        footerButtons={
          modalAction ? (
            // Confirmation modal with two buttons
            <div className="modal-btn-group">
              <button className="modal-close-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="modal-btn-danger" onClick={handleConfirmAction}>
                Confirm
              </button>
            </div>
          ) : (
            // Success/Error modal with one button
            <button className="modal-close-btn-primary" onClick={handleCloseModal}>
              Close
            </button>
          )
        }
      />
    </div>
  )
}

export default ArtistRequests