import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Video,Disc3 } from 'lucide-react'
import { SkeletonTheme } from 'react-loading-skeleton'

const PublicArtistProfile = () => {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`https://exodus-va6e.onrender.com/artists/${artistId}`)
      .then(res => {
        setArtist(res.data)
      })
      .finally(() => setLoading(false))
  }, [artistId])

  if (loading) return <div className="skeleton-container"><SkeletonTheme baseColor="#1a1a1a" highlightColor="#2a2a2a"><Skeleton height={1000} /></SkeletonTheme></div>

  return (
    <div className="artist-details">
      {/* Header */}
      <div className="artist-details-header">
        <h1>Manage Artist Profile</h1>
        <p>Manage your artist profile on the artist profile.</p>
        <button className="go-back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>

      {/* Banner Section */}
      <div className="banner-section">
        <LazyLoadImage
          src={bannerFile ? URL.createObjectURL(bannerFile) : artist.banner_image_url}
          effect="blur"
          className="artist-banner"
          alt={`${artist.artist_name} banner`}
        />
        <input
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            style={{ display: 'none' }}
            id="banner-upload"
        />
      </div>

      {/* Artist Information */}
      <section className="info-section">
        <h3>Artist Information</h3>
        <p className="section-subtitle">Get people get to know your artist.</p>
        
        <div className="info-grid">
          <div className="info-field">
            <label>Artist Name</label>
              <div className="info-value">{artist.artist_name}</div>
          </div>

          <div className="info-field">
            <label>Genre</label>
              <div className="info-value">{artist.genres?.join(', ') || 'Hip-Hop'}</div>
          </div>

          <div className="info-field">
            <label>Artist Spotify Link</label>
              <div className="info-value">{artist.spotify_link || 'https://spotify.artist.co/mavomusicgroup'}</div>
          </div>

          <div className="info-field">
            <label>Apple Music Link</label>
              <div className="info-value">{artist.apple_music_link || 'https://music.apple.com/us/artist/mavomusicgroup'}</div>
          </div>

          <div className="info-field">
            <label>YouTube Link</label>
              <div className="info-value">{artist.youtube_link || 'https://www.youtube.com/@mavomusicgroup'}</div>
          </div>

          <div className="info-field">
            <label>YouTube Music Link</label>
              <div className="info-value">{artist.youtube_music_link || 'https://music.youtube.com/channel/mavomusicgroup'}</div>
          </div>

          <div className="info-field">
            <label>Instagram Link</label>
              <div className="info-value">{artist.instagram_link || 'https://www.instagram.com/mavomusicgroup'}</div>
          </div>

          <div className="info-field">
            <label>X Link</label>
              <div className="info-value">{artist.x_link || 'https://www.x.com/mavomusicgroup'}</div>
          </div>

          <div className="info-field">
            <label>TikTok Link</label>
              <div className="info-value">{artist.tiktok_link || 'https://www.tiktok.com/@mavomusicgroup'}</div>
          </div>
        </div>
      </section>

      {/* Musics Section */}
      <section className="content-section">
        <div className="section-header">
          <div>
            <h3>Musics</h3>
          </div>
        </div>

        {artist.songs?.length ? (
          <div className="songs-grid">
            {artist.songs.map(song => (
              <div key={song.id} className="song-card">
                <img src={song.cover_art_url} alt={song.song_name} />
                <h4>{song.song_name}</h4>
                <p>{song.artist_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Disc3 size={48} />
            <h4>No tracks yet!</h4>
            <p>Artist is probably New to EMG we would get you their music very soon!.</p>
          </div>
        )}
      </section>

      {/* Videos Section */}
      <section className="content-section">
        <div className="section-header">
          <div>
            <h3>Videos</h3>
          </div>
        </div>

        {artist.videos?.length ? (
          <div className="videos-grid">
            {artist.videos.map(video => (
              <div key={video.id} className="video-card-grid">
                <iframe
                  src={video.video_link}
                  title={video.video_name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Video size={48} />
            <h4>No videos yet!</h4>
            <p>Artist is probably New to EMG we would get you their videos very soon!</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default PublicArtistProfile