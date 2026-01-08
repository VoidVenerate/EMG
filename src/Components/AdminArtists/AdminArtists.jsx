import axios from 'axios'
import { useState, useEffect } from 'react'
import './AdminArtists.css'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const AdminArtists = () => {
  const [artists, setArtists] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cardPerPage = 9
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const api = axios.create({
    baseURL: 'https://exodus-va6e.onrender.com',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  useEffect(() => {
    fetchArtists()
  }, [page])

  const fetchArtists = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!token) return

      const res = await api.get('/artists', {
        params: { page, per_page: cardPerPage },
      })

      setArtists(res.data.data)
      setMeta(res.data.meta)
    } catch (err) {
      console.error(err)
      setError('Failed to load artists.')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (event) => {
    setPage(event.selected + 1)
  }

  return (
    <div className="roster-section" style={{marginLeft:'5vw'}}>
      <h1 className="roster-title">EMG Artists</h1>
      <p style={{ fontSize: '16px', color: '#FFFFFFB2', textAlign: 'left', marginTop: '-2rem', marginBottom: '3rem' }}>
        The Voices to our sound
      </p>

      {error && <p className="error">{error}</p>}

      {/* GRID */}
      <SkeletonTheme
        baseColor="rgba(255,255,255,0.08)"
        highlightColor="rgba(255,255,255,0.25)"
      >
        <div className="roster-grid">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="roster-card skeleton">
                  <Skeleton height={470} borderRadius={8} />
                </div>
              ))
            : artists.map((artist) => (
                <div
                  key={artist.id}
                  className="roster-card"
                  onClick={() => navigate(`/admin/artists/${artist.id}`)}
                >
                  <LazyLoadImage
                    src={artist.image_url || '/avatar-fallback.png'}
                    alt={artist.artist_name}
                    effect="blur"
                    className="roster-img"
                  />
                  <div className="roster-overlay">
                    <p>{artist.artist_name}</p>
                  </div>
                </div>
              ))}
        </div>
      </SkeletonTheme>

      {/* PAGINATION */}
      {meta && meta.total_pages > 1 && (
        <ReactPaginate
          previousLabel="← Prev"
          nextLabel="Next →"
          pageCount={meta.total_pages}
          onPageChange={handlePageChange}
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
    </div>
  )
}

export default AdminArtists