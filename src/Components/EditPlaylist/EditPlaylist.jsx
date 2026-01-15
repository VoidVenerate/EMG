import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { CloudUpload } from 'lucide-react'

const EditPlaylist = ({
  redirectTo = '/get-playlist'
}) => {
  const navigate = useNavigate()
  const { playlistId } = useParams()
  const token = localStorage.getItem('token')

  const [playlist, setPlaylist] = useState({
    playlist_name: '',
    linktree: '',
    cover_art: null,
    cover_preview: null,
    existing_cover_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    fetchPlaylist()
  }, [playlistId])

  const fetchPlaylist = async () => {
    try {
      setFetchLoading(true)
      const res = await axios.get(`https://exodus-va6e.onrender.com/playlists/${playlistId}`)
      
      setPlaylist({
        playlist_name: res.data.playlist_name || '',
        linktree: res.data.linktree || '',
        cover_art: null,
        cover_preview: null,
        existing_cover_url: res.data.cover_art_url || ''
      })
    } catch (err) {
      console.error(err)
      toast.error('Failed to load playlist')
      navigate(redirectTo)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setPlaylist(prev => ({ ...prev, [field]: value }))
  }

  const handleCoverUpload = (file) => {
    if (!file) return
    setPlaylist(prev => ({
      ...prev,
      cover_art: file,
      cover_preview: URL.createObjectURL(file)
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const formData = new FormData()
      
      // Only append fields that have values
      if (playlist.playlist_name.trim()) {
        formData.append('playlist_name', playlist.playlist_name)
      }
      if (playlist.linktree.trim()) {
        formData.append('linktree', playlist.linktree)
      }
      if (playlist.cover_art) {
        formData.append('cover_art', playlist.cover_art)
      }

      await axios.patch(
        `https://exodus-va6e.onrender.com/playlists/admin-edit/${playlistId}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      )

      toast.success('Playlist updated successfully! 🎵')
      navigate(redirectTo)
    } catch (err) {
      console.error('Error details:', err.response?.data || err)
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          err.response.data.detail.forEach(error => {
            const location = Array.isArray(error.loc) ? error.loc.join(' -> ') : error.loc
            toast.error(`${location}: ${error.msg}`)
          })
        } else {
          toast.error(err.response.data.detail)
        }
      } else {
        toast.error('Failed to update playlist')
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = playlist.playlist_name.trim() && playlist.linktree.trim()

  if (fetchLoading) {
    return (
      <div className="add-videos-container">
        <div className="add-videos-header">
          <div className="header-left">
            <h2>Edit Playlist</h2>
            <p style={{ color: '#FFFFFFB2' }}>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="add-videos-container">
      <div className="add-videos-header">
        <div className="header-left">
          <h2>Edit Playlist</h2>
          <p style={{ color: '#FFFFFFB2' }}>Update your playlist details</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate(-1)} className="go-back-btn">Go Back</button>
        </div>
      </div>
      <span className="hr-span"></span>

      <div className="add-playlists">
        <div className="playlist-row">
          <h2>Playlist Details</h2>
          <p style={{ color: '#FFFFFFB2', fontSize: '12px' }}>
            Update playlist information and cover art
          </p>

          <div className="file-upload-box image-upload-box">
            {playlist.cover_preview || playlist.existing_cover_url ? (
              <img 
                src={playlist.cover_preview || playlist.existing_cover_url} 
                alt="Cover preview" 
                className="profile-image-preview" 
              />
            ) : (
              <>
                <CloudUpload size={30} />
                <span>Upload Cover Art</span>
                <p>SVG, PNG, JPG or GIF</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleCoverUpload(e.target.files[0])}
            />
          </div>

          <input
            placeholder="Playlist Name"
            value={playlist.playlist_name}
            onChange={(e) => handleChange('playlist_name', e.target.value)}
          />

          <input
            placeholder="Linktree"
            value={playlist.linktree}
            onChange={(e) => handleChange('linktree', e.target.value)}
          />

          <div className="actions">
            <button onClick={handleSubmit} disabled={loading || !isFormValid}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPlaylist