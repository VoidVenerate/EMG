import axios from 'axios'
import { useState, useEffect } from 'react'
import './NewMusic.css'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const NewMusic = () => {
  const [allFeaturedSongs, setAllFeaturedSongs] = useState([])
  const [currentSongs, setCurrentSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [saving, setSaving] = useState(false)

  const songsPerPage = 9
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchFeaturedMusic()
  }, [])

  useEffect(() => {
    // Update current songs when page changes
    const startIndex = currentPage * songsPerPage
    const endIndex = startIndex + songsPerPage
    setCurrentSongs(allFeaturedSongs.slice(startIndex, endIndex))
  }, [currentPage, allFeaturedSongs])

  const fetchFeaturedMusic = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await axios.get('https://exodus-va6e.onrender.com/new-music/')

      setAllFeaturedSongs(res.data)
      setCurrentSongs(res.data.slice(0, songsPerPage))
    } catch (err) {
      console.error(err)
      setError('Failed to load new music.')
    } finally {
      setLoading(false)
    }
  }

  const handleReorderSong = async (songId, direction) => {
    if (!allFeaturedSongs.length) return

    const currentIndex = allFeaturedSongs.findIndex(item => item.song.id === songId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= allFeaturedSongs.length) return

    // Swap positions locally for instant UI feedback
    const updatedSongs = [...allFeaturedSongs]
    ;[updatedSongs[currentIndex], updatedSongs[newIndex]] = [updatedSongs[newIndex], updatedSongs[currentIndex]]

    // Update positions according to new order
    const reorderData = {
      positions: updatedSongs.map((item, index) => ({
        song_id: item.song.id,
        position: index + 1
      }))
    }

    try {
      setSaving(true)
      await axios.patch(
        'https://exodus-va6e.onrender.com/new-music/admin-reorder',
        reorderData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // Update state with reordered songs
      setAllFeaturedSongs(updatedSongs.map((item, index) => ({
        ...item,
        position: index + 1
      })))

      toast.success('Songs reordered successfully!')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.detail || 'Failed to reorder songs')
      // Revert on error
      fetchFeaturedMusic()
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Are you sure you want to remove this song from new music?')) return

    try {
      setSaving(true)
      await axios.delete(
        `https://exodus-va6e.onrender.com/new-music/admin-remove/${songId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // Remove song from state
      const updatedSongs = allFeaturedSongs.filter(item => item.song.id !== songId)
      
      // Recalculate positions
      const reorderedSongs = updatedSongs.map((item, index) => ({
        ...item,
        position: index + 1
      }))

      setAllFeaturedSongs(reorderedSongs)
      toast.success('Song removed from new music!')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.detail || 'Failed to remove song')
    } finally {
      setSaving(false)
    }
  }

  const handlePageChange = (event) => {
    setCurrentPage(event.selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pageCount = Math.ceil(allFeaturedSongs.length / songsPerPage)

  const handleSongClick = (song, e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.reorder-btn') || e.target.closest('.delete-btn')) {
      return
    }

    // Navigate to the song's linktree or artist page
    if (song.linktree) {
      window.open(song.linktree, '_blank')
    } else {
      navigate(`/artists/${song.artist_id}`)
    }
  }

  return (
    <div className="new-music-page">
      <h1 className="new-music-title">New Music</h1>
      <p className="new-music-subtitle">
        The latest drops from EMG, all in one place.
      </p>
      <div className="toggle-btn">
        <button className='music-action-btn' onClick={() => navigate('/admin/new-music')} style={{background:'#dadadaff', color:'#000'}}>New Music</button>
        <button className='music-action-btn' onClick={() => navigate('/get-playlist')}>Playlist</button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* GRID */}
      <SkeletonTheme
        baseColor="rgba(255,255,255,0.08)"
        highlightColor="rgba(255,255,255,0.25)"
      >
        <div className="new-music-grid">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="music-card skeleton">
                  <Skeleton height={350} borderRadius={16} />
                </div>
              ))
            : currentSongs.map((item, index) => {
                const globalIndex = currentPage * songsPerPage + index
                return (
                  <div
                    key={item.song.id}
                    className="music-card"
                    onClick={(e) => handleSongClick(item.song, e)}
                  >
                    <div className="music-image-wrapper">
                      <LazyLoadImage
                        src={item.song.cover_art_url || '/cover-fallback.png'}
                        alt={item.song.song_name}
                        effect="blur"
                        className="music-image"
                      />
                    </div>

                    {/* Admin Controls - Reorder Only */}
                    {token && (
                      <div className="music-admin-controls">
                        <button
                          className="reorder-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReorderSong(item.song.id, 'up')
                          }}
                          disabled={globalIndex === 0 || saving}
                          title="Move Up"
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          className="reorder-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReorderSong(item.song.id, 'down')
                          }}
                          disabled={globalIndex === allFeaturedSongs.length - 1 || saving}
                          title="Move Down"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    )}

                    <div className="music-info">
                      <h3 className="music-song-name">{item.song.song_name}</h3>
                      <p className="music-artist-name">{item.song.artist_name}</p>

                      {/* Action Buttons */}
                      {token && (
                        <div className="music-actions">
                          <a
                            href={item.song.linktree}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="music-action-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Link
                          </a>

                          <button
                            className="music-action-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/artists/${item.song.artist_id}/songs/${item.song.id}/edit`)
                            }}
                          >
                            Edit Song
                          </button>

                          <button
                            className="music-action-btn music-delete-action"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSong(item.song.id)
                            }}
                            disabled={saving}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
        </div>
      </SkeletonTheme>

      {/* PAGINATION */}
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

      {allFeaturedSongs.length === 0 && !loading && (
        <div className="empty-state">
          <p>No new music available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default NewMusic