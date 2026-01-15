import axios from 'axios'
import { useState, useEffect } from 'react'
import './GetPlaylist.css'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import toast from 'react-hot-toast'

const GetPlaylist = () => {
  const [allPlaylists, setAllPlaylists] = useState([])
  const [currentPlaylists, setCurrentPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const playlistsPerPage = 9
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const barcodeImage = '/barcode.png'

  useEffect(() => {
    fetchPlaylists()
  }, [])

  useEffect(() => {
    const startIndex = currentPage * playlistsPerPage
    const endIndex = startIndex + playlistsPerPage
    setCurrentPlaylists(allPlaylists.slice(startIndex, endIndex))
  }, [currentPage, allPlaylists])

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await axios.get('https://exodus-va6e.onrender.com/playlists/')

      setAllPlaylists(res.data)
      setCurrentPlaylists(res.data.slice(0, playlistsPerPage))
    } catch (err) {
      console.error(err)
      setError('Failed to load playlists.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return

    try {
      setDeleting(true)
      await axios.delete(
        `https://exodus-va6e.onrender.com/playlists/admin-delete/${playlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // Remove playlist from state
      const updatedPlaylists = allPlaylists.filter(item => item.id !== playlistId)
      setAllPlaylists(updatedPlaylists)
      toast.success('Playlist deleted successfully!')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.detail || 'Failed to delete playlist')
    } finally {
      setDeleting(false)
    }
  }

  const handlePageChange = (event) => {
    setCurrentPage(event.selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaylistClick = (playlist, e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.playlist-actions') || e.target.closest('.music-action-btn')) {
      return
    }

    if (playlist.linktree) {
      window.open(playlist.linktree, '_blank')
    }
  }

  const pageCount = Math.ceil(allPlaylists.length / playlistsPerPage)

  return (
    <div className="playlists-page">
      <h1 className="playlists-title">Playlists</h1>
      <p className="playlists-subtitle">Curated collections from EMG</p>

      {error && <p className="error">{error}</p>}

      <div className="playlist-buttons">
        <div className="toggle-btn">
          <button 
            className='music-action-btn' 
            onClick={() => navigate('/admin/new-music')}
          >
            New Music
          </button>
          <button 
            className='music-action-btn' 
            onClick={() => navigate('/get-playlist')} 
            style={{background:'#dadadaff', color:'#000'}}
          >
            Playlist
          </button>
        </div>

        {token && (
          <button 
            className='add-action-btn' 
            onClick={() => navigate('/add-playlist')}
          >
            Add Playlist
          </button>
        )}
      </div>

      <SkeletonTheme
        baseColor="rgba(255,255,255,0.08)"
        highlightColor="rgba(255,255,255,0.25)"
      >
        <div className="playlists-grid">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="playlist-card skeleton">
                  <Skeleton height={350} borderRadius={16} />
                </div>
              ))
            : currentPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="playlist-card"
                  onClick={(e) => handlePlaylistClick(playlist, e)}
                >
                  <div className="playlist-image-wrapper">
                    <LazyLoadImage
                      src={playlist.cover_art_url || '/playlist-fallback.png'}
                      alt={playlist.playlist_name}
                      effect="blur"
                      className="playlist-image"
                    />
                    
                    {/* Bottom overlay with spotify and barcode only */}
                    <div className="playlist-overlay">
                      <div className="overlay-content">
                        {/* Left side - Spotify badge */}
                        <div className="playlist-info-left">
                          <div className="spotify-badge">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                          </div>
                        </div>

                        {/* Right side - Barcode */}
                        <div className="barcode">
                          <img src={barcodeImage} alt="barcode" className="barcode-image" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Playlist Name Below Image */}
                  <h3 className="playlist-name">{playlist.playlist_name}</h3>

                  {/* Action Buttons for Admin */}
                  {token && (
                    <div className="playlist-actions">
                      <a
                        href={playlist.linktree}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="music-action-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open Playlist
                      </a>

                      <button
                        className="music-action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/edit-playlist/${playlist.id}`)
                        }}
                      >
                        Edit Playlist
                      </button>

                      <button
                        className="music-action-btn music-delete-action"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePlaylist(playlist.id)
                        }}
                        disabled={deleting}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </SkeletonTheme>

      {pageCount > 1 && !loading && (
        <ReactPaginate
          previousLabel="← Prev"
          nextLabel="Next →"
          pageCount={pageCount}
          onPageChange={handlePageChange}
          forcePage={currentPage}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          disabledClassName="disabled"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
        />
      )}

      {allPlaylists.length === 0 && !loading && (
        <div className="empty-state">
          <p>No playlists available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default GetPlaylist