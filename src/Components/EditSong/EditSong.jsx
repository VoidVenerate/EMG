import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { CloudUpload } from 'lucide-react'

const EditSong = () => {
  const { songId, artistId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [song, setSong] = useState({
    song_name: '',
    artist_name: '',
    artist_id: null,
    linktree: '',
    cover_art: null,
    cover_preview: null,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const api = axios.create({
    baseURL: 'https://exodus-va6e.onrender.com',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // Fetch existing song data
  useEffect(() => {
    if (!artistId || !songId) return

    const fetchSong = async () => {
      try {
        setFetching(true)

        const res = await api.get(
          `/artists/${artistId}/songs`
        )

        const foundSong = res.data.find(
          s => String(s.id) === String(songId)
        )

        if (!foundSong) {
          toast.error('Song not found')
          navigate(-1)
          return
        }

        setSong({
          song_name: foundSong.song_name ?? '',
          artist_name: foundSong.artist_name ?? '',
          artist_id: foundSong.artist_id ?? null,
          linktree: foundSong.linktree ?? '',
          cover_art: null,
          cover_preview: foundSong.cover_art_url ?? null,
        })
      } catch (err) {
        console.error(err.response?.data || err)
        toast.error('Failed to load song')
      } finally {
        setFetching(false)
      }
    }

    fetchSong()
  }, [artistId, songId])


  const handleChange = (field, value) => {
    setSong(prev => ({ ...prev, [field]: value }))
  }

  const handleCoverUpload = (file) => {
    if (!file) return
    setSong(prev => ({
      ...prev,
      cover_art: file,
      cover_preview: URL.createObjectURL(file)
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const formData = new FormData()
      
      // Only append fields that have been modified
      if (song.song_name) formData.append('song_name', song.song_name)
      if (song.artist_name) formData.append('artist_name', song.artist_name)
      if (song.artist_id !== null) formData.append('artist_id', song.artist_id)
      if (song.linktree) formData.append('linktree', song.linktree)
      if (song.cover_art) formData.append('cover_art', song.cover_art)

      await api.patch(`/songs/admin-edit-song/${songId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Song updated successfully! 🎶')
      navigate(-1)
    } catch (err) {
      console.error(err.response?.data || err)
      toast.error(err.response?.data?.detail || 'Failed to update song')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = song.song_name.trim() && song.linktree.trim()

  if (fetching) {
    return (
      <div className="add-videos-container">
        <div className="add-songs">
          <div className="song-row">
            <p style={{ textAlign: 'center', color: '#FFFFFFB2' }}>
              Loading song data...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="add-videos-container">
      <div className="add-videos-header">
        <div className="header-left">
          <h2>Edit Song</h2>
          <p style={{ color: '#FFFFFFB2' }}>Update your song details</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
      <span className="hr-span"></span>

      <div className="add-songs">
        <div className="song-row">
          <h2>Song Details</h2>
          <p style={{ color: '#FFFFFFB2', fontSize: '12px', marginBottom: '24px' }}>
            Update your song information
          </p>

          <div className="file-upload-box image-upload-box">
            {song.cover_preview ? (
              <img
                src={song.cover_preview}
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
            placeholder="Artist Name(s)"
            value={song.artist_name}
            onChange={(e) => handleChange('artist_name', e.target.value)}
          />

          <input
            placeholder="Song Name"
            value={song.song_name}
            onChange={(e) => handleChange('song_name', e.target.value)}
          />

          <input
            placeholder="Linktree URL"
            value={song.linktree}
            onChange={(e) => handleChange('linktree', e.target.value)}
          />

          <div className="actions">
            <button onClick={() => navigate(-1)}>
              Skip
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
            >
              {loading ? 'Updating...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditSong