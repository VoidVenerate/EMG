import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Music, Video } from 'lucide-react'
import './UserArtistDetails.css'
import { SkeletonTheme } from 'react-loading-skeleton'

const UserArtistDetails = () => {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)

  const getYouTubeVideoId = (url) => {
    try {
      const parsed = new URL(url)

      // youtube.com/watch?v=ID
      if (parsed.hostname.includes('youtube.com')) {
        return parsed.searchParams.get('v')
      }

      // youtu.be/ID
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.replace('/', '')
      }

      return null
    } catch {
      return null
    }
  }

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
        <h1>{artist.artist_name}</h1>
        <p>Explore music and videos from {artist.artist_name}</p>
        <button className="go-back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>

      {/* Banner Section */}
      <div className="banner-section">
        <LazyLoadImage
          src={artist.banner_image_url}
          effect="blur"
          className="artist-banner"
          alt={`${artist.artist_name} banner`}
          style={{width:'100%'}}
        />
      </div>

      {/* Artist Information */}
      <section className="info-section">
        <h3>Artist Information</h3>
        <p className="section-subtitle">Get to know {artist.artist_name}</p>
        
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
            <div className="info-value">
              {artist.spotify_link ? (
                <a href={artist.spotify_link} target="_blank" rel="noopener noreferrer" className="info-link">
                  {artist.spotify_link}
                </a>
              ) : (
                'Not available'
              )}
            </div>
          </div>

          <div className="info-field">
            <label>Apple Music Link</label>
            <div className="info-value">
              {artist.apple_music_link ? (
                <a href={artist.apple_music_link} target="_blank" rel="noopener noreferrer" className="info-link">
                  {artist.apple_music_link}
                </a>
              ) : (
                'Not available'
              )}
            </div>
          </div>

          <div className="info-field">
            <label>YouTube Link</label>
            <div className="info-value">
              {artist.youtube_link ? (
                <a href={artist.youtube_link} target="_blank" rel="noopener noreferrer" className="info-link">
                  {artist.youtube_link}
                </a>
              ) : (
                'Not available'
              )}
            </div>
          </div>

          <div className="info-field">
            <label>YouTube Music Link</label>
            <div className="info-value">
              {artist.youtube_music_link ? (
                <a href={artist.youtube_music_link} target="_blank" rel="noopener noreferrer" className="info-link">
                  {artist.youtube_music_link}
                </a>
              ) : (
                'Not available'
              )}
            </div>
          </div>

          <div className="info-field">
            <label>Instagram Link</label>
            <div className="info-value">
              {artist.instagram_link ? (
                <a href={artist.instagram_link} target="_blank" rel="noopener noreferrer" className="info-link">
                  {artist.instagram_link}
                </a>
              ) : (
                'Not available'
              )}
            </div>
          </div>

          <div className="info-field">
            <label>X Link</label>
            <div className="info-value">
              {artist.x_link ? (
                <a href={artist.x_link} target="_blank" rel="noopener noreferrer" className="info-link">
                  {artist.x_link}
                </a>
              ) : (
                'Not available'
              )}
            </div>
          </div>

          <div className="info-field">
            <label>TikTok Link</label>
            <div className="info-value">
              {artist.tiktok_link ? (
                <a href={artist.tiktok_link} target="_blank" rel="noopener noreferrer" className="info-link">
                  {artist.tiktok_link}
                </a>
              ) : (
                'Not available'
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Musics Section */}
      <section className="content-section">
        <div className="section-header">
          <div>
            <h3>Musics</h3>
            <p className="section-subtitle">Explore music from {artist.artist_name}</p>
          </div>
        </div>

        {artist.songs?.length ? (
          <div className="videos-grid">
            {artist.songs.map((song) => (
              <div key={song.id} className="music-card">
                
                {/* Thumbnail */}
                <div className="music-thumbnail-wrapper">
                  <img
                    src={song.cover_art_url}
                    alt={song.song_name}
                    className="music-thumb-img"
                  />
                </div>

                {/* Song Info & Actions */}
                <div className="videos-card-footer">
                  <div className="song-header">
                    <h4 className="videos-card-title">{song.song_name}</h4>
                  </div>
                  <p className="videos-card-subtitle">{song.artist_name}</p>

                  <div className="videos-card-actions">
                    <a
                      href={song.linktree}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-action-btn"
                    >
                      Listen Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Music size={48} />
            <h4>No tracks yet!</h4>
            <p>Check back soon for new music.</p>
          </div>
        )}
      </section>

      {/* Videos Section */}
      <section className="content-section">
        <div className="section-header">
          <div>
            <h3>Videos</h3>
            <p className="section-subtitle">Watch music videos from {artist.artist_name}</p>
          </div>
        </div>

        {artist.videos?.length ? (
          <div className="videos-grid">
            {artist.videos.map((video) => {
              const videoId = getYouTubeVideoId(video.video_link)
              const thumbnail = videoId
                ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                : video.thumbnail_url || 'https://via.placeholder.com/400x225?text=No+Preview'

              return (
                <div key={video.id} className="videos-card">
                  {/* Thumbnail */}
                  <div className="video-thumbnail-wrapper">
                    <img src={thumbnail} alt={video.video_name} className="video-thumb-img" />
                    <div className="video-play-icon">
                      <img src="/Youtube.png" alt="Play" />
                    </div>
                  </div>

                  {/* Video Info & Actions */}
                  <div className="videos-card-footer">
                    <h4 className="videos-card-title">{video.video_name}</h4>
                    <div className="videos-card-actions">
                      <a
                        href={video.video_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-action-btn"
                      >
                        Watch Now
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Video size={48} />
            <h4>No videos yet!</h4>
            <p>Check back soon for new videos.</p>
          </div>
        )}
      </section>

      {/* Artist Image Section */}
      <section className="content-section">
        <div className="section-header">
          <div>
            <h3>Artist Image</h3>
            <p className="section-subtitle">Official artist photo</p>
          </div>
        </div>

        <div className="artist-image-preview">
          <LazyLoadImage
            src={artist.image_url}
            effect="blur"
            alt={artist.artist_name}
            className="profile-preview"
          />
        </div>
      </section>
    </div>
  )
}

export default UserArtistDetails