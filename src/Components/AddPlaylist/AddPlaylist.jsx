import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Trash, CloudUpload } from 'lucide-react'
import './AddPlaylist.css'

const emptyPlaylist = {
  playlist_name: '',
  linktree: '',
  cover_art: null,
  cover_preview: null,
}

const AddPlaylist = ({
  redirectTo = '/get-playlist'
}) => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [playlists, setPlaylists] = useState([{ ...emptyPlaylist }])
  const [loading, setLoading] = useState(false)

  const handleChange = (index, field, value) => {
    const updated = [...playlists]
    updated[index][field] = value
    setPlaylists(updated)
  }

  const handleCoverUpload = (index, file) => {
    if (!file) return
    const updated = [...playlists]
    updated[index].cover_art = file
    updated[index].cover_preview = URL.createObjectURL(file)
    setPlaylists(updated)
  }

  const addRow = () => setPlaylists([...playlists, { ...emptyPlaylist }])
  const removeRow = (index) => setPlaylists(playlists.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Submit each playlist individually
      const promises = playlists.map(async (playlist) => {
        const formData = new FormData()
        formData.append('playlist_name', playlist.playlist_name)
        formData.append('linktree', playlist.linktree)
        formData.append('cover_art', playlist.cover_art)

        return axios.post(
          'https://exodus-va6e.onrender.com/playlists/admin-add',
          formData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        )
      })

      await Promise.all(promises)

      toast.success(`${playlists.length} playlist(s) added successfully! 🎵`)
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
        toast.error('Failed to add playlists')
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = playlists.every(playlist =>
    playlist.playlist_name.trim() &&
    playlist.linktree.trim() &&
    playlist.cover_art
  )

  return (
    <div className="add-videos-container">
      <div className="add-videos-header">
        <div className="header-left">
          <h2>Add Playlist</h2>
          <p style={{ color: '#FFFFFFB2' }}>Upload your playlists</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate(-1)} className="go-back-btn">Go Back</button>
        </div>
      </div>
      <span className="hr-span"></span>

      <div className="add-playlists">
        {playlists.map((playlist, i) => (
          <div key={i} className="playlist-row">
            <h2>Playlist Upload</h2>
            <p style={{ color: '#FFFFFFB2', fontSize: '12px' }}>
              Upload your playlists with cover art and linktree
            </p>

            {playlists.length > 1 && (
              <button onClick={() => removeRow(i)} className="delete-btn">
                <Trash size={16} />
              </button>
            )}

            <div className="file-upload-box image-upload-box">
              {playlist.cover_preview ? (
                <img src={playlist.cover_preview} alt="Cover preview" className="profile-image-preview" />
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
                onChange={(e) => handleCoverUpload(i, e.target.files[0])}
              />
            </div>

            <input
              placeholder="Playlist Name"
              value={playlist.playlist_name}
              onChange={(e) => handleChange(i, 'playlist_name', e.target.value)}
            />

            <input
              placeholder="Linktree"
              value={playlist.linktree}
              onChange={(e) => handleChange(i, 'linktree', e.target.value)}
            />

            {i === playlists.length - 1 && (
              <div className="playlist-add-button">
                <button onClick={addRow} className="playlist-row-add-new">Add New</button>
              </div>
            )}

            <div className="actions">
              <button onClick={handleSubmit} disabled={loading || !isFormValid}>
                {loading ? 'Uploading...' : 'Continue'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddPlaylist