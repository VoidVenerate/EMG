import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Music, Video, CloudUpload, Trash2, Edit, ExternalLink, ArrowUp, ArrowDown, Youtube } from 'lucide-react'
import './ArtistDetails.css'
import { SkeletonTheme } from 'react-loading-skeleton'

const ArtistDetails = () => {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [featuredSongs, setFeaturedSongs] = useState(new Set())

  
  // Remove these states as we no longer need them
  // const [bannerFile, setBannerFile] = useState(null)
  // const [profileFile, setProfileFile] = useState(null)

  const token = localStorage.getItem('token')

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
        setEditForm({
          artist_name: res.data.artist_name,
          genres: res.data.genres?.join(', ') || '',
          spotify_link: res.data.spotify_link || '',
          apple_music_link: res.data.apple_music_link || '',
          youtube_link: res.data.youtube_link || '',
          youtube_music_link: res.data.youtube_music_link || '',
          instagram_link: res.data.instagram_link || '',
          x_link: res.data.x_link || '',
          tiktok_link: res.data.tiktok_link || ''
        })
      })
      .finally(() => setLoading(false))
  }, [artistId])

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  // Updated: Auto-save banner on file selection
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('banner_image', file)

      const response = await axios.patch(
        `https://exodus-va6e.onrender.com/artists/admin-edit-artist/${artistId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setArtist(response.data)
      toast.success('Banner updated successfully! 🎉')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.detail || 'Failed to update banner')
    } finally {
      setSaving(false)
    }
  }

  // Updated: Auto-save profile image on file selection
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('profile_image', file)

      const response = await axios.patch(
        `https://exodus-va6e.onrender.com/artists/admin-edit-artist/${artistId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setArtist(response.data)
      toast.success('Profile image updated successfully! 🎉')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.detail || 'Failed to update profile image')
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const formData = new FormData()

      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== undefined && editForm[key] !== null) {
          if (key === 'genres') {
            const genresArray = editForm[key].split(',').map(g => g.trim()).filter(Boolean)
            formData.append('genres', JSON.stringify(genresArray))
          } else {
            formData.append(key, editForm[key])
          }
        }
      })

      const response = await axios.patch(
        `https://exodus-va6e.onrender.com/artists/admin-edit-artist/${artistId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setArtist(response.data)
      setEditMode(false)
      toast.success('Artist updated successfully! 🎉')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.detail || 'Failed to update artist')
    } finally {
      setSaving(false)
    }
  }

  const handleFeatureSong = async (songId) => {
    try {
      setSaving(true)

      await axios.post(
        `https://exodus-va6e.onrender.com/new-music/admin-add?song_id=${songId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setFeaturedSongs(prev => new Set(prev).add(songId))
      toast.success('Song added to new music! ⭐')

    } catch (error) {
      console.error(error)

      if (error.response?.status === 400) {
        setFeaturedSongs(prev => new Set(prev).add(songId))
        toast.error('Song already added')
      } else {
        toast.error(error.response?.data?.detail || 'Failed to add song')
      }
    } finally {
      setSaving(false)
    }
  }


  const handleReorderVideo = async (videoId, direction) => {
    if (!artist?.videos) return;

    const currentIndex = artist.videos.findIndex(v => v.id === videoId);
    if (currentIndex === -1) return;

    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= artist.videos.length) return;

    const updatedVideos = [...artist.videos];
    [updatedVideos[currentIndex], updatedVideos[newIndex]] = [updatedVideos[newIndex], updatedVideos[currentIndex]];

    const reorderData = updatedVideos.map((video, index) => ({
      id: video.id,
      position: index + 1,
    }));

    try {
      setSaving(true);
      await axios.patch(
        `https://exodus-va6e.onrender.com/artists/${artistId}/admin-reorder-videos`,
        { items: reorderData },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setArtist(prev => ({
        ...prev,
        videos: updatedVideos
      }));

      toast.success('Videos reordered successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || 'Failed to reorder videos');
    } finally {
      setSaving(false);
    }
  };

  const handleReorderSong = async (songId, direction) => {
    if (!artist?.songs) return;

    const currentIndex = artist.songs.findIndex(s => s.id === songId);
    if (currentIndex === -1) return;

    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= artist.songs.length) return;

    const updatedSongs = [...artist.songs];
    [updatedSongs[currentIndex], updatedSongs[newIndex]] = [updatedSongs[newIndex], updatedSongs[currentIndex]];

    const reorderData = updatedSongs.map((song, index) => ({
      id: song.id,
      position: index + 1,
    }));

    try {
      setSaving(true);
      await axios.patch(
        `https://exodus-va6e.onrender.com/artists/${artistId}/admin-reorder-songs`,
        { items: reorderData },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setArtist(prev => ({
        ...prev,
        songs: updatedSongs
      }));

      toast.success('Songs reordered successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || 'Failed to reorder songs');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false)
    setEditForm({
      artist_name: artist.artist_name,
      genres: artist.genres?.join(', ') || '',
      spotify_link: artist.spotify_link || '',
      apple_music_link: artist.apple_music_link || '',
      youtube_link: artist.youtube_link || '',
      youtube_music_link: artist.youtube_music_link || '',
      instagram_link: artist.instagram_link || '',
      x_link: artist.x_link || '',
      tiktok_link: artist.tiktok_link || ''
    })
  }

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return

    try {
      await axios.delete(
        `https://exodus-va6e.onrender.com/videos/admin-delete-video/${videoId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setArtist(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v.id !== videoId)
      }))
      
      toast.success('Video deleted successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete video')
    }
  }

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return

    try {
      await axios.delete(
        `https://exodus-va6e.onrender.com/songs/admin-delete-song/${songId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setArtist(prev => ({
        ...prev,
        songs: prev.songs.filter(s => s.id !== songId)
      }))

      toast.success('Song deleted successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete song')
    }
  }

  if (loading) return <div className="skeleton-container"><SkeletonTheme baseColor="#1a1a1a" highlightColor="#2a2a2a"><Skeleton height={1000} /></SkeletonTheme></div>

  return (
    <div className="artist-details" style={{marginLeft:'7vw',paddingRight:'2vw'}}>
      {/* Header */}
      <div className="artist-details-header">
        <h1>Manage Artist Profile</h1>
        <p>Manage your artist profile on the artist profile.</p>
        <button className="go-back-btn" style={{right:'0'}} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>

      {/* Banner Section */}
      <div className="banner-section">
        <img
          src={artist.banner_image_url}
          effect="blur"
          className="artist-banner"
          alt={`${artist.artist_name} banner`}
          style={{width:'100%'}}
        />
        <input
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            style={{ display: 'none' }}
            id="banner-upload"
            disabled={saving}
        />
            
        <label 
          htmlFor="banner-upload" 
          className="banner-uploads-overlay" 
          style={{ 
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1 
          }}
        >
          <CloudUpload size={32} />
          <p>{saving ? 'Uploading...' : 'Click to upload'}</p>
        </label>
      </div>

      {/* Artist Information */}
      
      <h3 style={{marginTop:'24px', marginLeft:"0vw", fontSize:"32px"}}>Artist Information</h3>
      <p style={{marginLeft:"0vw"}} className="section-subtitle">Get people get to know your artist.</p>
      <section className="info-section" style={{width:'100%'}}>
        
        <div className="info-grid">
          <div className="info-field">
            <label>Artist Name</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.artist_name}
                onChange={(e) => handleInputChange('artist_name', e.target.value)}
              />
            ) : (
              <div className="info-value">{artist.artist_name}</div>
            )}
          </div>

          <div className="info-field">
            <label>Genre</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.genres}
                onChange={(e) => handleInputChange('genres', e.target.value)}
                placeholder="Hip-Hop, R&B, Pop"
              />
            ) : (
              <div className="info-value">{artist.genres?.join(', ') || 'Hip-Hop'}</div>
            )}
          </div>

          <div className="info-field">
            <label>Artist Spotify Link</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.spotify_link}
                onChange={(e) => handleInputChange('spotify_link', e.target.value)}
              />
            ) : (
              <div className="info-value">{artist.spotify_link || 'https://spotify.artist.co/mavomusicgroup'}</div>
            )}
          </div>

          <div className="info-field">
            <label>Apple Music Link</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.apple_music_link}
                onChange={(e) => handleInputChange('apple_music_link', e.target.value)}
              />
            ) : (
              <div className="info-value">{artist.apple_music_link || 'https://music.apple.com/us/artist/mavomusicgroup'}</div>
            )}
          </div>

          <div className="info-field">
            <label>YouTube Link</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.youtube_link}
                onChange={(e) => handleInputChange('youtube_link', e.target.value)}
              />
            ) : (
              <div className="info-value">{artist.youtube_link || 'https://www.youtube.com/@mavomusicgroup'}</div>
            )}
          </div>

          <div className="info-field">
            <label>YouTube Music Link</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.youtube_music_link}
                onChange={(e) => handleInputChange('youtube_music_link', e.target.value)}
              />
            ) : (
              <div className="info-value">{artist.youtube_music_link || 'https://music.youtube.com/channel/mavomusicgroup'}</div>
            )}
          </div>

          <div className="info-field">
            <label>Instagram Link</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.instagram_link}
                onChange={(e) => handleInputChange('instagram_link', e.target.value)}
              />
            ) : (
              <div className="info-value">{artist.instagram_link || 'https://www.instagram.com/mavomusicgroup'}</div>
            )}
          </div>

          <div className="info-field">
            <label>X Link</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.x_link}
                onChange={(e) => handleInputChange('x_link', e.target.value)}
              />
            ) : (
              <div className="info-value">{artist.x_link || 'https://www.x.com/mavomusicgroup'}</div>
            )}
          </div>

          <div className="info-field">
            <label>TikTok Link</label>
            {editMode ? (
              <input
                type="text"
                className="info-input"
                value={editForm.tiktok_link}
                onChange={(e) => handleInputChange('tiktok_link', e.target.value)}
              />
            ) : (
              <div className="info-value">{artist.tiktok_link || 'https://www.tiktok.com/@mavomusicgroup'}</div>
            )}
          </div>
        </div>

        <div className="edit-links-btn">
          {!editMode ? (
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Musics Section */}
      <section className="content-section">
        <div className="section-header">
          <div>
            <h3>Musics</h3>
            <p className="section-subtitle">Manage artist music here.</p>
          </div>
          <button
            className="add-btn"
            onClick={() => navigate(`/admin/artist/${artistId}/addsongs`)}
          >
            Add Music
          </button>
        </div>

        {artist.songs?.length ? (
          <div className="videos-grid">
            {artist.songs.map((song, index) => (
              <div key={song.id} className="music-card">
                
                <div className="music-thumbnail-wrapper">
                  <img
                    src={song.cover_art_url}
                    alt={song.song_name}
                    className="music-thumb-img"
                  />
                </div>

                
                <div className="new-reorder-buttons" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'8px'}}>
                  <button
                    className="feature-btn"
                    onClick={() => handleFeatureSong(song.id)}
                    disabled={saving || featuredSongs.has(song.id)}
                    title="Add to New Music"
                  >
                    {featuredSongs.has(song.id) ? 'Added' : 'Add to New Music'}
                  </button>

                  <div className="video-reorder-buttons">
                    <button
                      className="reorder-btn"
                      onClick={() => handleReorderSong(song.id, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>

                    <button
                      className="reorder-btn"
                      onClick={() => handleReorderSong(song.id, 'down')}
                      disabled={index === artist.songs.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>

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
                      Open Link
                    </a>

                    <button
                      className="video-action-btn"
                      onClick={() => navigate(`/artists/${artistId}/songs/${song.id}/edit`)}
                    >
                      Edit Song
                    </button>

                    <button
                      className="video-action-btn video-delete-btn"
                      onClick={() => handleDeleteSong(song.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Music size={48} />
            <h4>No tracks yet!</h4>
            <p>Add songs to your artist profile.</p>
          </div>
        )}
      </section>

      {/* Videos Section */}
      <section className="content-section">
        <div className="section-header">
          <div>
            <h3>Videos</h3>
            <p className="section-subtitle">Manage your music here.</p>
          </div>
          <button className="add-btn" onClick={() => navigate(`/admin/artist/${artistId}/addvideos`)}>Add Video</button>
        </div>

        {artist.videos?.length ? (
          <div className="videos-grid">
            {artist.videos.map((video, index) => {
              const videoId = getYouTubeVideoId(video.video_link)
              const thumbnail = videoId
                ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                : video.thumbnail_url || 'https://via.placeholder.com/400x225?text=No+Preview'

              return (
                <div key={video.id} className="videos-card">
                  <div className="video-thumbnail-wrapper">
                    <img src={thumbnail} alt={video.video_name} className="video-thumb-img" />
                    <div className="video-play-icon">
                      <img src="/Youtube.png" />
                    </div>
                  </div>

                  <div className="video-reorder-buttons">
                    <button
                      onClick={() => handleReorderVideo(video.id, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                      style={{color:'#FFF'}}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleReorderVideo(video.id, 'down')}
                      disabled={index === artist.videos.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  <div className="videos-card-footer">
                    <h4 className="videos-card-title">{video.video_name}</h4>
                    <div className="videos-card-actions">
                      <a
                        href={video.video_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-action-btn"
                      >
                        Open Link
                      </a>
                      <button
                        className="video-action-btn"
                        onClick={() => navigate(`/admin/artists/${artistId}/videos/${video.id}`)}
                      >
                        Edit Video
                      </button>
                      <button
                        className="video-action-btn video-delete-btn"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash2 size={16} />
                      </button>
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
            <p>Add videos to your artist profile.</p>
          </div>
        )}
      </section>

      {/* Artist Image Section */}
      <section className="content-section">
        <div className="section-header">
          <div>
            <h3>Artist Image</h3>
            <p className="section-subtitle">Manage your artist cover art.</p>
          </div>
        </div>

        <div className="artist-image-preview">
          <LazyLoadImage
            src={artist.image_url}
            effect="blur"
            alt={artist.artist_name}
            className="profile-preview"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileUpload}
            style={{ display: 'none' }}
            id="profile-upload"
            disabled={saving}
          />
          <label 
            htmlFor="profile-upload" 
            className="uploads-overlay" 
            style={{ 
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1 
            }}
          >
            <CloudUpload size={32} />
            <p>{saving ? 'Uploading...' : 'Click to upload'}</p>
          </label>
        </div>

        <button className="delete-profile-btn">Delete Profile</button>
      </section>
    </div>
  )
}

export default ArtistDetails