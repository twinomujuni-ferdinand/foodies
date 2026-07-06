import React from 'react';
import { Link } from 'react-router-dom';
import '../CssModule/Navbar.css'; // ⬅️ make sure the path is correct

const Navbar = ({ onNavClick, refs, user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid">
        <button className="navbar-brand btn btn-link" onClick={() => onNavClick(refs.homeRef)}>
          Foodies
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => onNavClick(refs.homeRef)}>
                Home
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => onNavClick(refs.careerRef)}>
                Career
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => onNavClick(refs.aboutUsRef)}>
                About Us
              </button>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-link" to="/menu" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                Menu
              </Link>
            </li>
            <li className="nav-item">
              {(user && user.username) ? (
                <button className="nav-link btn btn-link" onClick={onLogout}>
                  Logout
                </button>
              ) : (
                <Link className="nav-link btn btn-link" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
