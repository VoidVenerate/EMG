import axios from 'axios'
import { useState, useEffect } from 'react'
import './UserPlaylists.css'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const UserPlaylists = () => {
  const [allPlaylists, setAllPlaylists] = useState([])
  const [currentPlaylists, setCurrentPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)

  const playlistsPerPage = 9
  const navigate = useNavigate()
  const discImage = '/playlist-disc.png'
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

  const handlePageChange = (event) => {
    setCurrentPage(event.selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaylistClick = (playlist) => {
    if (playlist.linktree) {
      window.open(playlist.linktree, '_blank')
    }
  }
  const splitPlaylistName = (name) => {
    const words = name.trim().split(' ')
    if (words.length === 1) {
      return { firstPart: name, lastWord: '' }
    }
    const lastWord = words.pop()
    const firstPart = words.join(' ')
    return { firstPart, lastWord }
  }

  const pageCount = Math.ceil(allPlaylists.length / playlistsPerPage)

  return (
    <div className="playlists-page" style={{marginLeft:'0px', padding:'46px'}}>
      <div className="playlists-page-header" style={{padding:'44px 64px'}}>
        <h1 className="playlists-title">EMG Playlists 🎧</h1>
        <p className="playlists-subtitle">Our playlist is expertly curated just for you.</p>
      </div>

      {error && <p className="error">{error}</p>}

      <SkeletonTheme
        baseColor="rgba(255,255,255,0.08)"
        highlightColor="rgba(255,255,255,0.25)"
      >
        <div className="playlists-grid" style={{marginTop:'3vw'}}>
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="playlist-card skeleton">
                  <Skeleton height={250} borderRadius={8} />
                </div>
              ))
            : currentPlaylists.map((playlist) => (
                <div
                    key={playlist.id}
                    className="playlist-card"
                    onClick={() => handlePlaylistClick(playlist)}
                >
                    {/* CD/VINYL DISC */}
                    <div className="disc-container">
                      <img src={discImage} alt="" className="disc-image" />
                      
                      {/* DISC CENTER WITH SPOTIFY LOGO */}
                      <div className="disc-center">
                        <div className="spotify-icon-center">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </div>
                      </div>

                      {/* PLAY/PAUSE BUTTON - TOP RIGHT */}
                      <div className="play-pause-btn">
                        <span>Play Playlist</span>
                      </div>

                      {/* BOTTOM OVERLAY WITH INFO */}
                      <div className="bottom-overlay">
                        <div className="overlay-content">
                          {/* LEFT SIDE - PLAYLIST NAME */}
                          <div className="playlist-info-left">
                            <h3 className="playlist-name">
                              {splitPlaylistName(playlist.playlist_name).firstPart}
                              {splitPlaylistName(playlist.playlist_name).lastWord && (
                                <>
                                  <br />
                                  {splitPlaylistName(playlist.playlist_name).lastWord}
                                </>
                              )}
                            </h3>
                            <div className="playlist-subtitle">
                              <div className="spotify-badge">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT SIDE - BARCODE */}
                          <div className="barcode">
                            <img src={barcodeImage} alt="barcode" className="barcode-image" />
                          </div>
                        </div>
                      </div>
                    </div>
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

export default UserPlaylists