import React, { useEffect, useState } from "react"
import ReactPaginate from "react-paginate"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const ITEMS_PER_PAGE = 9

const EMGArtistsComp = () => {
  const [artists, setArtists] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const cardPerPage = 9
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
    <section className="roster-section">
      <h2 className="roster-title">Our Roster</h2>
      {error && <p className="error">{error}</p>}

      <div className="roster-grid">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <Skeleton
                key={i}
                height={260}
                borderRadius={14}
                baseColor="#1a1a1a"
                highlightColor="#2a2a2a"
              />
            ))
          : artists.map(artist => (
              <div
                key={artist.id}
                className="roster-card"
                onClick={() => navigate(`/admin/artists/${artist.id}`)}
                style={{ cursor: "pointer" }}
              >
                <LazyLoadImage
                  src={artist.image_url}
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

      {!loading && meta?.total_pages > 1 && (
        <ReactPaginate
          previousLabel="Prev"
          nextLabel="Next"
          onPageChange={handlePageChange}
          pageCount={meta.total_pages}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          activeClassName="active"
          disabledClassName="disabled"
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          breakLabel={null}
        />
      )}
    </section>
  )
}

export default EMGArtistsComp
