import React, { useState } from 'react';
import axios from 'axios';
import './Spot.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Spot = () => {
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [igLink, setIgLink] = useState('');
  const [ytLink, setYtLink] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [appleMusicLink, setAppleMusicLink] = useState('');
  const navigate = useNavigate();

  const [musicDistribution, setMusicDistribution] = useState(false);
  const [musicPublishing, setMusicPublishing] = useState(false);
  const [prodAndEngineering, setProdAndEngineering] = useState(false);
  const [marketingAndPromotions, setMarketingAndPromotions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateForm = () => {
    if (!artistName || !email || !igLink || !ytLink || !spotifyLink || !appleMusicLink) {
      setError("Please fill all required fields.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    const requestData = {
      artist_name: artistName,
      email,
      ig_link: igLink,
      yt_link: ytLink,
      spotify_link: spotifyLink,
      apple_music_link: appleMusicLink,
      music_distribution: musicDistribution,
      music_publishing: musicPublishing,
      prod_and_engineering: prodAndEngineering,
      marketing_and_promotions: marketingAndPromotions,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        'https://exodus-va6e.onrender.com/artist-requests/submit',
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess("Your request has been submitted successfully!");
      // Reset form
      setArtistName('');
      setEmail('');
      setIgLink('');
      setYtLink('');
      setSpotifyLink('');
      setAppleMusicLink('');
      setMusicDistribution(false);
      setMusicPublishing(false);
      setProdAndEngineering(false);
      setMarketingAndPromotions(false);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError("You have already submitted a request with this email.");
      } else {
        setError("Failed to submit your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="art-form">
        <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft />
        </button>
        <div className="artist-form-container">
            <h2>Tell us about yourself.</h2>
            <p>Fill in the details below so we can know you better. Your info comes to us for gigs and collaborations.</p>

            <form className="artist-request-form" onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="form-group">
                <label>Artist Name <span className="required">*</span></label>
                <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
                </div>

                <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                <label>Instagram Link <span className="required">*</span></label>
                <input type="url" value={igLink} onChange={(e) => setIgLink(e.target.value)} />
                </div>

                <div className="form-group">
                <label>Youtube Link <span className="required">*</span></label>
                <input type="url" value={ytLink} onChange={(e) => setYtLink(e.target.value)} />
                </div>

                <div className="form-group">
                <label>Spotify Link <span className="required">*</span></label>
                <input type="url" value={spotifyLink} onChange={(e) => setSpotifyLink(e.target.value)} />
                </div>

                <div className="form-group">
                <label>Apple Music Link <span className="required">*</span></label>
                <input type="url" value={appleMusicLink} onChange={(e) => setAppleMusicLink(e.target.value)} />
                </div>

                <p className="service-title">Select Your Preferred Service(s)</p>
                <p className="service-subtitle">Choose services to boost your music career. From royalties to distribution, select options that fit your goals. This finalizes your profile.</p>

                <div className="service-checkboxes">
                <label><input type="checkbox" checked={musicDistribution} onChange={() => setMusicDistribution(!musicDistribution)} /> Music Distribution</label>
                <label><input type="checkbox" checked={musicPublishing} onChange={() => setMusicPublishing(!musicPublishing)} /> Music Publishing</label>
                <label><input type="checkbox" checked={prodAndEngineering} onChange={() => setProdAndEngineering(!prodAndEngineering)} /> Prod. & Engineering</label>
                <label><input type="checkbox" checked={marketingAndPromotions} onChange={() => setMarketingAndPromotions(!marketingAndPromotions)} /> Marketing & Promotions</label>
                </div>

                <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Confirm Your Spot"}</button>
            </form>
            </div>
    </div>
  );
};

export default Spot;
