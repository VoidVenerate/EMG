import React, { useState, useEffect } from "react";
import axios from "axios";
import { Lock, Eye, EyeOff } from "lucide-react";
import "./ProfileDark.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProfileDark = () => {
  const token = localStorage.getItem("token");

  // ====== STATE ======
  const [userData, setUserData] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ====== FEEDBACK ======
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isPasswordStrong = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

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

    try {
      const updatePromises = [];

      // ✅ Profile update (name, email, image)
      if (profileImageFile) {
        const formData = new FormData();
        
        // Add profile picture
        formData.append("profile_picture", profileImageFile);

        updatePromises.push(
          axios.patch(
            "https://exodus-va6e.onrender.com/auth/edit-profile",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
        );
      }

      // ✅ Password update (separate endpoint)
      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        if (!isPasswordStrong(password)) {
          setError(
            "Password must be stronger (8+ chars, upper, lower, number, special char)."
          );
          return;
        }
        if (!currentPassword) {
          setError("Current password is required to update your password.");
          return;
        }

        updatePromises.push(
          axios.patch(
            "https://exodus-va6e.onrender.com/auth/change-password",
            new URLSearchParams({
              current_password: currentPassword,
              new_password: password,
            }),
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
        );
      }

      if (updatePromises.length === 0) {
        setMessage("Nothing to update.");
        return;
      }

      setLoading(true);
      const results = await Promise.all(updatePromises);

      // ✅ If profile was updated, refresh user data
      const updatedProfile = results.find((res) =>
        res.config.url.includes("/edit-profile")
      );

      if (updatedProfile) {
        setUserData(updatedProfile.data);
        setProfileImagePreview(updatedProfile.data.profile_picture_url || "/placeholder.png");
        setProfileImageFile(null);
      }

      // Reset password fields
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");

      setMessage("Update successful!");
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
    <div className="profile-dark-container">
      <h2 className="profile-dark-title">PROFILE</h2>

      {message && <p className="success-message">{message}</p>}
      {error && userData && <p className="error">{error}</p>}

      {/* ====== PROFILE FORM ====== */}
      <form onSubmit={handleSubmit} className="profile-dark-content">
        {/* LEFT SIDE */}
        <div className="profile-dark-left">
          <p className="profile-dark-label">Profile Image</p>
          <p className="profile-dark-subtext">Displayed on your profile.</p>
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
              marginTop: "5vw",
              width: "100%",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.1)",
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

            {/* Current Password */}
            <div className="profile-dark-input-group">
              <label>Current Password</label>
              <div className="password-dark-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  required={password || confirmPassword}
                  style={{ padding: "20px 24px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-dark-icon"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-dark-row">
            {/* New Password */}
            <div className="profile-dark-input-group">
              <label>New Password</label>
              <div className="password-dark-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ padding: "20px 24px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-dark-icon"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="profile-dark-input-group">
              <label>Confirm New Password</label>
              <div className="password-dark-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ padding: "20px 24px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-dark-icon"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="profile-dark-btn-wrapper">
            <button className="profile-dark-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileDark;