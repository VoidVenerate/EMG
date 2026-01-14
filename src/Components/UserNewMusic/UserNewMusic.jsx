import axios from 'axios'
import { useState, useEffect } from 'react'
import './UserNewMusic.css'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const UserNewMusic = () => {
  const [allFeaturedSongs, setAllFeaturedSongs] = useState([])
  const [currentSongs, setCurrentSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)

  const songsPerPage = 9
  const navigate = useNavigate()

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

  const handlePageChange = (event) => {
    setCurrentPage(event.selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pageCount = Math.ceil(allFeaturedSongs.length / songsPerPage)

  const handleSongClick = (song) => {
    // Navigate to the song's linktree or artist page
    if (song.linktree) {
      window.open(song.linktree, '_blank')
    } else {
      navigate(`/artists/${song.artist_id}`)
    }
  }

  return (
    <div className="new-music-page" style={{marginTop:"0vw", marginLeft:'0px'}}>
      <h1 className="new-music-title">New Music</h1>
      <p className="new-music-subtitle">
        All the new music from your favourite artists
      </p>

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
            : currentSongs.map((item) => (
                <div
                  key={item.song.id}
                  className="new-music-card"
                >
                  <div className="music-image-wrapper">
                    <LazyLoadImage
                      src={item.song.cover_art_url || '/cover-fallback.png'}
                      alt={item.song.song_name}
                      effect="blur"
                      className="music-image"
                    />
                  </div>

                  <div className="music-info">
                    <h3 className="music-song-name">{item.song.song_name}</h3>
                    <p className="music-artist-name">{item.song.artist_name}</p>
                  </div>
                </div>
              ))}
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

export default UserNewMusic