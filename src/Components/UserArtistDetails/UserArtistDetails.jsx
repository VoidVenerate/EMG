import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Music, Video, ExternalLink } from 'lucide-react'
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

      if (parsed.hostname.includes('youtube.com')) {
        return parsed.searchParams.get('v')
      }

      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.replace('/', '')
      }

      return null
    } catch {
      return null
    }
  }

  const truncateUrl = (url, maxLength = 40) => {
    if (!url) return ''
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  const handleSongClick = (linktree) => {
    window.open(linktree, '_blank', 'noopener,noreferrer')
  }

  const handleVideoClick = (videoLink) => {
    window.open(videoLink, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    axios
      .get(`https://exodus-va6e.onrender.com/artists/${artistId}`)
      .then(res => {
        setArtist(res.data)
      })
      .finally(() => setLoading(false))
  }, [artistId])

  if (loading) return (
    <div className="skeleton-container">
      <SkeletonTheme baseColor="#1a1a1a" highlightColor="#2a2a2a">
        <Skeleton height={1000} />
      </SkeletonTheme>
    </div>
  )

  return (
    <div className="artist-details">

      {/* Banner Section */}
      <div className="banner-section">
        <LazyLoadImage
          src={artist.banner_image_url}
          effect="blur"
          className="artist-banner"
          alt={`${artist.artist_name} banner`}
          style={{width:'100%', filter: 'brightness(0.8)'}}
        />
      </div>

      {/* Artist Information Section */}
      <section className="content-section" style={{marginTop: '40px'}}>
        <div className="section-header">
          <div>
            <h3>Artist Information</h3>
            <p className="section-subtitle">Get to know {artist.artist_name}</p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-grid">
            <div className="info-field">
              <label>Artist Name</label>
              <div className="info-value">{artist.artist_name}</div>
            </div>

            <div className="info-field">
              <label>Genre</label>
              <div className="info-value">{artist.genres?.join(', ') || 'N/A'}</div>
            </div>

            {artist.spotify_link && (
              <div className="info-field">
                <label>Spotify</label>
                <div className="info-value info-link">
                  <span title={artist.spotify_link}>
                    {truncateUrl(artist.spotify_link)}
                  </span>
                  <a 
                    href={artist.spotify_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}

            {artist.apple_music_link && (
              <div className="info-field">
                <label>Apple Music</label>
                <div className="info-value info-link">
                  <span title={artist.apple_music_link}>
                    {truncateUrl(artist.apple_music_link)}
                  </span>
                  <a 
                    href={artist.apple_music_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}

            {artist.youtube_link && (
              <div className="info-field">
                <label>YouTube</label>
                <div className="info-value info-link">
                  <span title={artist.youtube_link}>
                    {truncateUrl(artist.youtube_link)}
                  </span>
                  <a 
                    href={artist.youtube_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}

            {artist.youtube_music_link && (
              <div className="info-field">
                <label>YouTube Music</label>
                <div className="info-value info-link">
                  <span title={artist.youtube_music_link}>
                    {truncateUrl(artist.youtube_music_link)}
                  </span>
                  <a 
                    href={artist.youtube_music_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}

            {artist.instagram_link && (
              <div className="info-field">
                <label>Instagram</label>
                <div className="info-value info-link">
                  <span title={artist.instagram_link}>
                    {truncateUrl(artist.instagram_link)}
                  </span>
                  <a 
                    href={artist.instagram_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}

            {artist.x_link && (
              <div className="info-field">
                <label>X (Twitter)</label>
                <div className="info-value info-link">
                  <span title={artist.x_link}>
                    {truncateUrl(artist.x_link)}
                  </span>
                  <a 
                    href={artist.x_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}

            {artist.tiktok_link && (
              <div className="info-field">
                <label>TikTok</label>
                <div className="info-value info-link">
                  <span title={artist.tiktok_link}>
                    {truncateUrl(artist.tiktok_link)}
                  </span>
                  <a 
                    href={artist.tiktok_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}
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
              <div 
                key={song.id} 
                className="music-card clickable-card" 
                style={{border:'0px', cursor: 'pointer'}}
                onClick={() => handleSongClick(song.linktree)}
              >
                
                <div className="music-thumbnail-wrapper">
                  <img
                    src={song.cover_art_url}
                    alt={song.song_name}
                    className="music-thumb-img"
                  />
                </div>

                <div className="videos-card-footer" style={{padding:'0px',paddingTop:'16px'}}>
                  <div className="song-header">
                    <h4 className="videos-card-title">{song.song_name}</h4>
                  </div>
                  <p className="videos-card-subtitle">{song.artist_name}</p>
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
                <div 
                  key={video.id} 
                  className="videos-card clickable-card"
                  style={{cursor: 'pointer'}}
                  onClick={() => handleVideoClick(video.video_link)}
                >
                  <div className="video-thumbnail-wrapper">
                    <img src={thumbnail} alt={video.video_name} className="video-thumb-img" />
                    <div className="video-play-icon">
                      <img src="/Youtube.png" alt="Play" />
                    </div>
                  </div>

                  <div className="videos-card-footer">
                    <h4 className="videos-card-title">{video.video_name}</h4>
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
    </div>
  )
}

export default UserArtistDetails