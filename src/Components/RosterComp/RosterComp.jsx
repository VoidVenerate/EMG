import React, { useEffect, useState } from "react"
import ReactPaginate from "react-paginate"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./RosterComp.css"

const ITEMS_PER_PAGE = 9

const RosterComp = () => {
  const [artists, setArtists] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  const navigate = useNavigate()

  const fetchArtists = async (page = 1) => {
    try {
      setLoading(true)
      const res = await axios.get(
        `https://exodus-va6e.onrender.com/artists`,
        {
          params: {
            page,
            per_page: ITEMS_PER_PAGE
          }
        }
      )

      setArtists(res.data.data)
      setMeta(res.data.meta)
    } catch (err) {
      console.error("Failed to fetch artists", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists(currentPage + 1)
  }, [currentPage])

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected)
  }

  return (
    <section className="roster-section">
      <h2 className="roster-title">Our Roster</h2>

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
                onClick={() => navigate(`/artists/${artist.id}`)}
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
          onPageChange={handlePageClick}
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

export default RosterComp
