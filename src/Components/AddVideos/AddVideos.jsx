import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash } from 'lucide-react'
import './AddVideos.css'

const emptyVideo = {
  video_name: '',
  video_link: '',
}

const AddVideos = ({ showSkip = true }) => { // ✅ prop for skip button
  const { artistId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [videos, setVideos] = useState([emptyVideo])
  const [loading, setLoading] = useState(false)

  const handleChange = (index, field, value) => {
    const updated = [...videos]
    updated[index][field] = value
    setVideos(updated)
  }

  const addRow = () => setVideos([...videos, emptyVideo])
  const removeRow = (index) => setVideos(videos.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const payload = new URLSearchParams()

      payload.append(
        'videos',
        JSON.stringify(
          videos.map((v) => ({
            video_name: v.video_name,
            video_link: v.video_link,
            artist_name: 'Unknown Artist', // ✅ REQUIRED (replace if you have real name)
            artist_id: Number(artistId),
          }))
        )
      )

      await axios.post(
        'https://exodus-va6e.onrender.com/videos/admin-add-video',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      toast.success('Videos added successfully')
      navigate(`/admin/artists/${artistId}`)
    } catch (err) {
      console.error(err?.response?.data || err)
      toast.error('Failed to add videos')
    } finally {
      setLoading(false)
    }
  }


  const isFormValid = videos.every(
    (video) => video.video_name.trim() && video.video_link.trim()
  )

  return (
    <div className="add-videos-container">
      <div className="add-videos-header">
        <div className="header-left">
            <h2>Add Video</h2>
            <p style={{color:'#FFFFFFB2'}}>Upload your artist videos</p>
        </div>
        <div className="header-right">
            <button onClick={() => navigate(-1)}>
                Go Back
            </button>
        </div>
      </div>
      <span className='hr-span'></span>
      <div className="add-videos">
        <div className="video-card">
          <h3>Video Upload</h3>
          <p>Upload some or all of your artist videos</p>

          {videos.map((video, i) => (
            <div key={i} className="video-row">
              {videos.length > 1 && (
                <button className="delete-btn" onClick={() => removeRow(i)}>
                  <Trash size={16} />
                </button>
              )}

              <label>Video Name</label>
              <input
                placeholder="Video Name"
                value={video.video_name}
                onChange={(e) => handleChange(i, 'video_name', e.target.value)}
              />

              <label>Video Link</label>
              <input
                placeholder="Video URL"
                value={video.video_link}
                onChange={(e) => handleChange(i, 'video_link', e.target.value)}
              />
            </div>
          ))}

          <div className="actions">
            {showSkip && (
              <button onClick={() => navigate(`/admin/artists/${artistId}`)}>Skip</button>
            )}
            <button onClick={handleSubmit} disabled={loading || !isFormValid}>
              {loading ? 'Saving...' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddVideos
