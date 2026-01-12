import React, { useState } from 'react';

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

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/new-music', label: 'New Music' },
    { to: '/roster', label: 'Roster' },
    { to: '/playlists', label: 'Playlists' }
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #0B0B0F;
          padding-top: 100px;
        }

        .navbar {
          background-color: #0B0B0F;
          padding: 24px 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
        }

        .navbar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .navbar-logo img {
          height: 2.5rem;
        }

        .navbar-links {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
          flex: 1;
          justify-content: center;
        }

        .navbar-link {
          color: #555;
          text-decoration: none;
          font-weight: 500;
          margin-left: 2rem;
          transition: color 0.3s ease;
          cursor: pointer;
        }

        .navbar-link:hover,
        .navbar-link.active {
          color: #AC8900;
        }

        .navbar-button button {
          padding: 18px 20px;
          border: 1px solid #AC8900;
          cursor: pointer;
          font-weight: 400;
          background-color: #AC8900;
          letter-spacing: 3px;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease, box-shadow 0.3s ease;
          color: #fff;
          border-radius: 4px;
        }

        .navbar-button button:hover {
          box-shadow:
            0 0 8px rgba(172, 137, 0, 0.6),
            0 0 20px rgba(172, 137, 0, 0.4);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          width: 25px;
          height: 20px;
        }

        .hamburger span {
          height: 3px;
          background: #fff;
          border-radius: 2px;
          transition: 0.3s ease;
        }

        .hamburger span:nth-child(3) {
          width: 15px;
        }

        .hamburger.open span:nth-child(1),
        .hamburger.open span:nth-child(3) {
          position: absolute;
          top: 8px;
          width: 25px;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg);
        }

        .desktop-only {
          display: block;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 1024px) {
          .navbar {
            flex-direction: column;
            align-items: stretch;
          }

          .hamburger {
            display: flex;
            z-index: 1000;
          }

          .navbar-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: #000;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: 0.4s ease;
            z-index: 999;
          }

          .navbar-links.open {
            max-height: 500px;
            padding: 20px 0;
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          .navbar-links li {
            opacity: 0;
            transform: translateX(-20px);
            transition: 0.3s ease;
          }

          .navbar-links.open li {
            opacity: 1;
            transform: translateX(0);
          }

          .navbar-link {
            padding: 12px 20px;
            color: #7f7f7f;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: block;
          }

          .navbar-link:hover {
            background: rgba(84, 35, 210, 0.1);
            color: #fff;
            padding-left: 30px;
          }

          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: block;
            margin: 15px 20px 0;
          }
        }

        @media (max-width: 430px) {
          .navbar-link,
          .navbar-button button {
            font-size: 0.9rem;
          }
        }

        .demo-content {
          padding: 40px;
          color: #fff;
          text-align: center;
        }

        .demo-content h1 {
          color: #AC8900;
          margin-bottom: 20px;
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-header">
          <div className="navbar-logo">
            <a href="/home">
              <img src="/emg-logo.png" alt="Exodus Music Group" />
            </a>
          </div>

          <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.to}
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="navbar-button mobile-only">
            <a
              href="/confirmspot"
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
              }}
            >
              <button>Confirm Your Spot</button>
            </a>
          </li>
        </ul>

        <div className="navbar-button desktop-only">
          <a
            href="/confirmspot"
            className="navbar-link"
            onClick={(e) => e.preventDefault()}
          >
            <button>Confirm Your Spot</button>
          </a>
        </div>
      </nav>
    </>
  );
};

export default UserNavbar;