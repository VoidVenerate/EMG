import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash, CloudUpload } from 'lucide-react'
import './AddSong.css'

const emptySong = {
  song_name: '',
  artist_name: '',
  linktree: '',
  cover_art: null,
  cover_preview: null,
}

const AddSong = ({
  requireArtistName = true,
  showSkip = false,
  redirectTo = '/',
  skipRedirect = '/'
}) => {
  const navigate = useNavigate()
  const { artistId: paramArtistId } = useParams()
  const artistId = paramArtistId // always get artistId from URL
  const token = localStorage.getItem('token')

  const [songs, setSongs] = useState([{ ...emptySong }])
  const [loading, setLoading] = useState(false)

  const handleChange = (index, field, value) => {
    const updated = [...songs]
    updated[index][field] = value
    setSongs(updated)
  }

  const handleCoverUpload = (index, file) => {
    if (!file) return
    const updated = [...songs]
    updated[index].cover_art = file
    updated[index].cover_preview = URL.createObjectURL(file)
    setSongs(updated)
  }

  const addRow = () => setSongs([...songs, { ...emptySong }])
  const removeRow = (index) => setSongs(songs.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    if (!artistId) {
      toast.error('artistId is missing. Cannot add songs.')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      
      // Prepare songs data array
      const songsData = songs.map(song => ({
        song_name: song.song_name,
        artist_name: song.artist_name,
        linktree: song.linktree,
        artist_id: Number(artistId),
      }))

      // Add songs as JSON string
      formData.append('songs', JSON.stringify(songsData))

      // Append cover arts
      songs.forEach(song => {
        if (song.cover_art) {
          formData.append('cover_arts', song.cover_art)
        }
      })

      const response = await axios.post(
        'https://exodus-va6e.onrender.com/songs/admin-add-song',
        formData,
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      )

      toast.success(`${response.data.length} song(s) added successfully! 🎶`)
      navigate(redirectTo.replace(':artistId', artistId))
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
        toast.error('Failed to add songs')
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = songs.every(song =>
    song.song_name.trim() &&
    song.linktree.trim() &&
    song.cover_art &&
    (!requireArtistName || song.artist_name.trim())
  )

  return (
    <div className="add-videos-container">
      <div className="add-videos-header">
        <div className="header-left">
          <h2>Add Music</h2>
          <p style={{ color: '#FFFFFFB2' }}>Upload your artist musics</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
        </div>
      </div>
      <span className="hr-span"></span>

      <div className="add-songs">
        {songs.map((song, i) => (
          <div key={i} className="song-row">
            <h2>Music Upload</h2>
            <p style={{ color: '#FFFFFFB2', fontSize: '12px' }}>
              Upload some or all of your artist songs
            </p>

            {songs.length > 1 && (
              <button onClick={() => removeRow(i)} className="delete-btn">
                <Trash size={16} />
              </button>
            )}

            <div className="file-upload-box image-upload-box">
              {song.cover_preview ? (
                <img src={song.cover_preview} alt="Cover preview" className="profile-image-preview" />
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

            {requireArtistName && (
              <input
                placeholder="Artist Name(s)"
                value={song.artist_name}
                onChange={(e) => handleChange(i, 'artist_name', e.target.value)}
              />
            )}

            <input
              placeholder="Song Name"
              value={song.song_name}
              onChange={(e) => handleChange(i, 'song_name', e.target.value)}
            />

            <input
              placeholder="Linktree"
              value={song.linktree}
              onChange={(e) => handleChange(i, 'linktree', e.target.value)}
            />

            {i === songs.length - 1 && (
              <div className="song-add-button">
                <button onClick={addRow} className="song-row-add-new">Add New</button>
              </div>
            )}

            <div className="actions">
              {showSkip && (
                <button onClick={() => navigate(skipRedirect.replace(':artistId', artistId))}>
                  Skip
                </button>
              )}
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

export default AddSong
