import React, { useState, useEffect } from "react";
import axios from "axios";
import { Lock } from "lucide-react";
import "./ProfileDark.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal"; // Import the modal

const ProfileDark = () => {
  const token = localStorage.getItem("token");

  // ====== STATE ======
  const [userData, setUserData] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // ====== FEEDBACK ======
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ====== FETCH USER ======
  useEffect(() => {
    if (!token) {
      setError("Not authenticated. Please log in.");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://exodus-va6e.onrender.com/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
        setProfileImagePreview(res.data.profile_picture_url || "/placeholder.png");
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // ====== IMAGE HANDLER ======
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImageFile(file);
      setProfileImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ====== SUBMIT FORM ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Only update profile image if a new one is selected
    if (!profileImageFile) {
      setMessage("No changes to save.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile_picture", profileImageFile);

      const res = await axios.patch(
        "https://exodus-va6e.onrender.com/auth/edit-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData(res.data);
      setProfileImagePreview(res.data.profile_picture_url || "/placeholder.png");
      setProfileImageFile(null);
      setMessage("Profile image updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ====== CONDITIONAL UI ======
  if (!token) return <p>Please log in to view your profile.</p>;
  if (loading && !userData) return <p>Loading...</p>;
  if (error && !userData) return <p className="error">{error}</p>;

  return (
    <>
      <div className="profile-dark-container">
        <h2 className="profile-dark-title" style={{fontFamily:'DM Sans'}}>PROFILE</h2>
        <p className="profile-dark-subtext">Displayed on your profile.</p>
        <span className="hr-span"></span>

        {message && <p className="success-message">{message}</p>}
        {error && userData && <p className="error">{error}</p>}

        {/* ====== PROFILE FORM ====== */}
        <form onSubmit={handleSubmit} className="profile-dark-content">
          {/* LEFT SIDE */}
          <div className="profile-dark-left">
            <div className="profile-dark-header-section" style={{width:'100%'}}> 
              <p className="profile-dark-label">Profile Image</p>
              <p className="profile-dark-subtext">This will be displayed on your profile.</p>
            </div>
            <span className="hr-span"></span>
            <LazyLoadImage
              src={profileImagePreview}
              alt="Profile"
              loading="lazy"
              effect="blur"
              className="profile-dark-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.png";
              }}
            />
            <input
              type="file"
              accept="image/*"
              id="profileImageInput"
              style={{ display: "none" }}
              onChange={handleProfileImageChange}
            />
            <button
              type="button"
              className="profile-dark-btn"
              onClick={() => document.getElementById("profileImageInput").click()}
              style={{
                width: "100%",
                border: "1px solid #FFFFFF33",
                background: "#FFFFFF0D",
                borderRadius: "5px",
              }}
            >
              Change Profile Image
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="profile-dark-right">
            <div className="profile-dark-row">
              {/* First Name */}
              <div className="profile-dark-input-group">
                <label>Firstname</label>
                <div className="profile-dark-input-disabled">
                  <input type="text" value={userData?.first_name || ""} readOnly />
                  <Lock size={16} color="#666" />
                </div>
              </div>

              {/* Last Name */}
              <div className="profile-dark-input-group">
                <label>Lastname</label>
                <div className="profile-dark-input-disabled">
                  <input type="text" value={userData?.last_name || ""} readOnly />
                  <Lock size={16} color="#666" />
                </div>
              </div>
            </div>

            <div className="profile-dark-row">
              {/* Email */}
              <div className="profile-dark-input-group">
                <label>Email</label>
                <div className="profile-dark-input-disabled">
                  <input type="email" value={userData?.email || ""} readOnly />
                  <Lock size={16} color="#666" />
                </div>
              </div>

              {/* Password with toggle visibility */}
              <div className="profile-dark-input-group">
                <label>Password</label>
                <div className="profile-dark-input-disabled">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={userData?.password || "••••••••"} 
                    readOnly 
                    style={{
                      fontSize:'32px',
                      fontWeight:'700',
                      height:'42px'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Change Password Button */}
            <div className="profile-dark-btn-wrapper">
              <button 
                type="button" 
                className="profile-dark-btn"
                onClick={() => setShowChangePasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        show={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onForgotPassword={() => {
          // You can add forgot password logic here if needed
          console.log("Forgot password clicked");
        }}
      />
    </>
  );
};

export default ProfileDark;