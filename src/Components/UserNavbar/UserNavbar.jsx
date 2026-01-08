import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './UserNavbar.css';

const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const newState = !prev;
      if (newState) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
      return newState;
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <div className="navbar-logo">
          <NavLink to='/home'>
            <img src='/emg-logo.png' alt="Exodus Music Group" />
          </NavLink>
        </div>

        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink
            to="/home"
            exact="true"
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/roster"
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            onClick={() => setMenuOpen(false)}
          >
            Roster
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/new-music"
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            onClick={() => setMenuOpen(false)}
          >
            New Music
          </NavLink>
        </li>
        <li className="navbar-button mobile-only">
          <NavLink
            to="/confirmspot"
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            onClick={() => setMenuOpen(false)}
          >
            <button>
              Confirm Your Spot
            </button>
          </NavLink>
        </li>
      </ul>
      <div className="navbar-button desktop-only">
          <NavLink
              to="/confirmspot"
              className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
              onClick={() => setMenuOpen(false)}
            >
              <button>
                Confirm Your Spot
              </button>
            </NavLink>
        </div>

      
    </nav>
  );
};

export default UserNavbar;
