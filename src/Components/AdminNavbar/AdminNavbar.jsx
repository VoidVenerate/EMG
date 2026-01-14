import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Disc3,
  Mail,
  House,
  LogOut,
  User
} from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Modal from '../Modal/Modal';
import './AdminNavbar.css';

const API_BASE_URL = 'https://exodus-va6e.onrender.com';
const DEFAULT_AVATAR = '/default-avatar.png';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /* -------------------- MENU TOGGLE -------------------- */
  const toggleMenu = () => {
    setMenuOpen(prev => {
      document.body.classList.toggle('menu-open', !prev);
      return !prev;
    });
  };

  /* -------------------- FETCH USER PROFILE -------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;
        setUserName(user.first_name || '');
        setProfileImage(
          user.profile_picture_url ||
          user.profile_picture ||
          null
        );
      } catch (err) {
        console.error('Failed to load user profile:', err);
      }
    };

    fetchProfile();
  }, []);

  /* -------------------- LETTER AVATAR -------------------- */
  const renderLetterAvatar = () => {
    const letter = userName ? userName[0].toUpperCase() : '?';
    const colors = ['#6A5ACD', '#FF6347', '#2E8B57', '#FFB400', '#4682B4'];
    const bgColor = colors[letter.charCodeAt(0) % colors.length];

    return (
      <div
        className="letter-avatar"
        style={{
          backgroundColor: bgColor,
          color: '#fff',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {letter}
      </div>
    );
  };

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/login');
  };

  /* -------------------- RENDER -------------------- */
  return (
    <>
      <nav className="admin-navbar">

        {/* ===== TOP SECTION ===== */}
        <div className="admin-navbar-top">
            <div className="admin-navbar-header">
            <NavLink to="/adminhome" className="admin-navbar-logo">
                <img src="/Exodus-logo.jpg" width="56px" alt="Exodus Music Group" />
            </NavLink>

            <div
                className={`hamburger ${menuOpen ? 'open' : ''}`}
                onClick={toggleMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
            </div>

            <ul className={`admin-navbar-links ${menuOpen ? 'open' : ''}`}>
              {/* Regular Navigation Links */}
              <li>
                <NavLink to="/adminhome" className="admin-navbar-link" onClick={() => setMenuOpen(false)}>
                  <House />
                  <span className="nav-label">Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/emgartist" className="admin-navbar-link" onClick={() => setMenuOpen(false)}>
                  <Users />
                  <span className="nav-label">Artists</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/new-music" className="admin-navbar-link" onClick={() => setMenuOpen(false)}>
                  <Disc3 />
                  <span className="nav-label">New Music</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/subscriptions" className="admin-navbar-link" onClick={() => setMenuOpen(false)}>
                  <Mail />
                  <span className="nav-label">Subscriptions</span>
                </NavLink>
              </li>

              {/* Mobile-only: Profile and Logout */}
              <li className="mobile-only">
                <NavLink to="/me" className="admin-navbar-link" onClick={() => setMenuOpen(false)}>
                  <User />
                  <span className="nav-label">Profile</span>
                </NavLink>
              </li>
              <li className="mobile-only">
                <button 
                  className="admin-navbar-link logout-link" 
                  onClick={() => {
                    setMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                >
                  <LogOut />
                  <span className="nav-label">Logout</span>
                </button>
              </li>
            </ul>
        </div>

        {/* ===== BOTTOM SECTION (Desktop Only) ===== */}
        <div className="admin-navbar-bottom desktop-only">
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              <LogOut size={16} />
            </button>

            <div className="profile-container">
              {profileImage ? (
                <LazyLoadImage
                  src={profileImage}
                  effect="blur"
                  className="profile-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onError={e => (e.target.src = DEFAULT_AVATAR)}
                />
              ) : (
                renderLetterAvatar()
              )}

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <NavLink to="/me" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Profile
                  </NavLink>
                </div>
              )}
            </div>
        </div>
      </nav>

      {/* Modal Component */}
      <Modal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        subMessage="You will need to log back in to access your account."
        type="logout"
        footerButtons={
          <div className="modal-btn-group">
            <button className="modal-close-btn" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </button>
            <button className="modal-btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        }
      />
    </>
  );
};

export default AdminNavbar;