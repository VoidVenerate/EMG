import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import './List.css'
import { BookCopy, SquareCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../Modal/Modal' // Import Modal

const copyToClipboard = (value) => {
  navigator.clipboard.writeText(value)
  toast.success('Copied to clipboard!')
}

const ArtistCard = ({ artist, onDelete }) => (
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

    <p className="date">
      Requested on: {new Date(artist.created_at).toLocaleDateString()}
    </p>

    {/* ACTIONS */}
    <div className="artist-card-actions">
      <button className="delete-request-btn" onClick={() => onDelete(artist.id, artist.artist_name)}>
        Remove Request
      </button>
    </div>

  </div>
)



const List = () => {

    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const requestsPerPage = 6

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

    const handleDelete = async (id, artistName) => {
      showConfirmModal(
        'Remove Artist Request',
        `Are you sure you want to remove ${artistName}'s request?`,
        'This action cannot be undone.',
        async () => {
          try {
            await axios.delete(`https://exodus-va6e.onrender.com/artist-requests/admin-remove-request/${id}`, { headers })
            setRequests(prev => prev.filter(r => r.id !== id))
            showSuccessModal(
              'Request Removed!',
              `${artistName}'s request has been removed.`,
              'The request has been permanently deleted from the system.'
            )
          } catch (err) {
            console.error(err)
            showErrorModal(
              'Removal Failed',
              `Failed to remove ${artistName}'s request.`,
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
    <div className="artistRequests-section" style={{marginLeft:"3vw"}}>
      <div className="artist-header-section">
        <div className="section-section">
          <h2>Artist List</h2>
          <p>List of potential artists for emg.</p>
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

export default List