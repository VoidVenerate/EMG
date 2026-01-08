import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'

const EditVideo = () => {
  const { videoId, artistId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [video, setVideo] = useState({
    video_name: '',
    video_link: '',
    artist_name: '',
    artist_id: null,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const api = axios.create({
    baseURL: 'https://exodus-va6e.onrender.com',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // Fetch existing video data
  useEffect(() => {
    if (!videoId || !artistId) return
    const fetchVideo = async () => {
      try {
        setFetching(true)
        const res = await api.get(`/artists/${artistId}/videos`)
        const data = res.data

        const foundVideo = data.find(v => String(v.id) === String(videoId))
        if (!foundVideo) {
          toast.error('Video not found')
          navigate(-1)
          return
        }

        setVideo({
          video_name: foundVideo.video_name || '',
          video_link: foundVideo.video_link || '',
          artist_name: foundVideo.artist_name || '',
          artist_id: foundVideo.artist_id || null,
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to load video')
      } finally {
        setFetching(false)
      }
    }
    fetchVideo()
  }, [videoId, artistId])

  const handleChange = (field, value) => {
    setVideo(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const formData = new URLSearchParams()
      
      // Only append fields that have been provided
      if (video.video_name) formData.append('video_name', video.video_name)
      if (video.video_link) formData.append('video_link', video.video_link)
      if (video.artist_name) formData.append('artist_name', video.artist_name)
      if (video.artist_id !== null) formData.append('artist_id', video.artist_id)

      await api.patch(`/videos/admin-edit-video/${videoId}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      toast.success('Video updated successfully! 🎬')
      navigate(-1)
    } catch (err) {
      console.error(err.response?.data || err)
      toast.error(err.response?.data?.detail || 'Failed to update video')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = video.video_name.trim() && video.video_link.trim()

  if (fetching) {
    return (
      <div className="add-videos-container">
        <div className="add-videos">
          <div className="video-card">
            <p style={{ textAlign: 'center', color: '#FFFFFFB2' }}>
              Loading video data...
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
          <h2>Edit Video</h2>
          <p style={{ color: '#FFFFFFB2' }}>Update your video details</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
      <span className="hr-span"></span>

      <div className="add-videos">
        <div className="video-card">
          <h3>Video Details</h3>
          <p>Update your video information</p>

          <div className="video-row">
            <label>Artist Name</label>
            <input
              placeholder="Artist Name"
              value={video.artist_name}
              onChange={(e) => handleChange('artist_name', e.target.value)}
            />

            <label>Video Name</label>
            <input
              placeholder="Video Name"
              value={video.video_name}
              onChange={(e) => handleChange('video_name', e.target.value)}
            />

            <label>Video Link</label>
            <input
              placeholder="Video URL (YouTube link auto-generates thumbnail)"
              value={video.video_link}
              onChange={(e) => handleChange('video_link', e.target.value)}
            />
          </div>

          <div className="actions">
            <button onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading || !isFormValid}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditVideo