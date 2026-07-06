import React from 'react';
import { useNavigate } from 'react-router-dom';
import MidSection from './MidSection';
import '../CssModule/HomePage.css';

const HomePage = ({ menuRef }) => {
  const navigate = useNavigate();
  // Scroll handler (optional, keep if you want smooth scroll for old UI)
  const scrollToMenu = () => {
    if (menuRef && menuRef.current) {
      menuRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Banner Start - full width */}
      <div className="w-100 position-relative rounded-0 shadow overflow-hidden" style={{ height: '640px', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', position: 'relative' }}>
        <img
          src="/banner.jpg"
          alt="Welcome Banner"
          className="w-100 h-100 position-absolute top-0 start-0 banner-image"
          style={{ objectFit: 'cover', zIndex: 1 }}
        />

        {/* Logo as text */}
        <div
          className="position-absolute top-0 start-0 m-3 d-flex align-items-center justify-content-center fade-in"
          style={{
            width: '320px',
            height: '100px',
            zIndex: 3,
            background: 'rgba(255,255,255,0.98)',
            borderRadius: '50px',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            border: '2.5px solid #ffd700',
            padding: '0 32px',
          }}
        >
          <span
            style={{
              fontWeight: 900,
              fontSize: '2.2rem',
              fontFamily: 'cursive, sans-serif',
              letterSpacing: '2px',
              background: 'linear-gradient(90deg, #ffd700 20%, #ffb300 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 8px rgba(0,0,0,0.10)',
              display: 'inline-block',
            }}
          >
            Foodies Restaurant
          </span>
        </div>

        {/* Text Content */}
        <div
          className="position-absolute top-50 start-50 translate-middle text-white text-center px-4 py-3 fade-in-delay"
          style={{
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '0.5rem',
            zIndex: 2,
            minWidth: '60%',
          }}
        >
          <h1 className="display-4 banner-heading">Welcome to Foodies</h1>
          <p className="lead banner-subtext">Explore our services and offerings below.</p>
          <button
            onClick={() => navigate('/menu')}
            className="btn btn-warning mt-3 px-4 py-2 fw-bold"
          >
            Order Now
          </button>
        </div>
      </div>
      {/* Banner End */}

      <section id="home" className="container mt-5">
        <MidSection />
      </section>
    </>
  );
};

export default HomePage;
