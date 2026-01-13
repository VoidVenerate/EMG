import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CloudUpload } from 'lucide-react'
import './AddArtist.css'
import { useNavigate } from 'react-router-dom'

const AddArtist = ({ onArtistCreated }) => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    artist_name: '',
    genres: '',
    spotify_link: '',
    apple_music_link: '',
    youtube_link: '',
    youtube_music_link: '',
    instagram_link: '',
    x_link: '',
    tiktok_link: '',
  })
  const [bannerImage, setBannerImage] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const navigate = useNavigate()


  const token = localStorage.getItem('token')
  const api = axios.create({
    baseURL: 'https://exodus-va6e.onrender.com',
    headers: { Authorization: `Bearer ${token}` },
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.artist_name || !form.genres || !bannerImage || !profileImage) {
      toast.error('Artist name, genres, banner & profile images are required')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()

       // 🔥 Convert genres to JSON array string
        const genresArray = form.genres
        .split(',')
        .map(g => g.trim())
        .filter(Boolean)

        formData.append('artist_name', form.artist_name)
        formData.append('genres', JSON.stringify(genresArray))

      Object.entries(form).forEach(([key, value]) => {
        if (
            value &&
            key !== 'artist_name' &&
            key !== 'genres'
        ) {
            formData.append(key, value)
        }
      })
      formData.append('banner_image', bannerImage)
      formData.append('profile_image', profileImage)

      const res = await api.post('/artists/admin-add-artist', formData,)

      toast.success('Artist created successfully 🎉')
      onArtistCreated(res.data)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to create artist')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = form.artist_name.trim() &&
    form.genres.trim() &&
    bannerImage &&
    profileImage

  return (
    <div className="add-artist-section">
        <div className="add-videos-header" style={{marginLeft:"5vw"}}>
            <div className="header-left">
            <h2>Add Artist</h2>
            <p style={{ color: '#FFFFFFB2' }}>Add an artist profile to EMG Website.</p>
            </div>
            <div className="header-right">
            <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </div>
        <span className="hr-span"></span>
        <div className="container-section">
            <div className="add-artist-container">
                <form className="add-artist-form" onSubmit={handleSubmit}>

                    {/* Banner Upload */}
                    <div className="upload-section">
                        <label>
                            Banner Upload <span className="required">*</span>
                        </label>
                        <p>Upload the artist banner image: 1440px wide, 433px high.</p>

                        <div className="file-upload-box banner-box">
                            {bannerPreview ? (
                            <img
                                src={bannerPreview}
                                alt="Banner preview"
                                className="banner-image-preview banner-preview"
                            />
                            ) : (
                            <>
                                <CloudUpload size={30} />
                                <span>Click to upload</span>
                            </>
                            )}

                            <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0]
                                if (!file) return
                                setBannerImage(file)
                                setBannerPreview(URL.createObjectURL(file))
                            }}
                            />
                        </div>
                    </div>


                    {/* Profile Image Upload */}
                    <div className="upload-section">
                        <label>
                            Image Upload <span className="required">*</span>
                        </label>
                        <p>Upload the artist profile image: 445px wide, 500px high.</p>

                        <div className="file-upload-box image-upload-box">
                            {profilePreview ? (
                            <img
                                src={profilePreview}
                                alt="Profile preview"
                                className="profile-image-preview profile-preview"
                            />
                            ) : (
                            <>
                                <CloudUpload size={30} />
                                <span>Click to upload</span>
                            </>
                            )}

                            <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0]
                                if (!file) return
                                setProfileImage(file)
                                setProfilePreview(URL.createObjectURL(file))
                            }}
                            />
                        </div>
                    </div>


                    {/* Artist Information */}
                    <div className="artist-info-section">
                    <div className="field-group">
                        <label>
                        Artist Name <span className="required">*</span>
                        </label>
                        <input
                        name="artist_name"
                        placeholder="Artist Name"
                        onChange={handleChange}
                        />
                    </div>

                    <div className="field-group">
                        <label>
                        Genre <span className="required">*</span>
                        </label>
                        <input
                        name="genres"
                        placeholder='Genres JSON e.g. ["Hip Hop","R&B"]'
                        onChange={handleChange}
                        />
                    </div>

                    <div className="field-group">
                        <label>Spotify Profile Link</label>
                        <input name="spotify_link" placeholder="Spotify Link" onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>Apple Music Link</label>
                        <input name="apple_music_link" placeholder="Apple Music Link" onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>YouTube Link</label>
                        <input name="youtube_link" placeholder="YouTube Link" onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>YouTube Music Link</label>
                        <input name="youtube_music_link" placeholder="YouTube Music Link" onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>Instagram Link</label>
                        <input name="instagram_link" placeholder="Instagram Link" onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>X (Twitter) Link</label>
                        <input name="x_link" placeholder="X Link" onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>TikTok Link</label>
                        <input name="tiktok_link" placeholder="TikTok Link" onChange={handleChange} />
                    </div>
                    </div>

                    <div className="add-button">
                        <button type="submit" disabled={loading || !isFormValid}>
                            {loading ? 'Continuing...' : 'Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddArtist