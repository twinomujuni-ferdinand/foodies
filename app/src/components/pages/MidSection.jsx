/*const MidSection = () => (
  <div className="row mt-4">
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Feature 1</h5>
          <p className="card-text">Some quick information about feature 1.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Feature 2</h5>
          <p className="card-text">Some quick information about feature 2.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Feature 3</h5>
          <p className="card-text">Some quick information about feature 3.</p>
        </div>
      </div>
    </div>
  </div>
);
export default MidSection*/

import React from 'react'

const cardBackgrounds = [
  'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80")',
  'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80")',
  'url("https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80")'
];

const MidSection = ({ menuRef }) => {
  const handleCardClick = (index) => {
    if (index === 0 && menuRef && menuRef.current) {
      menuRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ color: '#af9817' }}>Why Choose Us?</h2>
      <div className="row g-4">
        {[
          { icon: '🍽️', title: 'Delicious Menu', desc: 'A wide variety of dishes to satisfy every craving.' },
          { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Prepared by top culinary professionals.' },
          { icon: '⚡', title: 'Fast Service', desc: 'Get served quickly without sacrificing quality.' },
        ].map((item, i) => (
          <div className="col-md-4" key={i}>
            <div
              className="card shadow-sm h-100 text-center p-4 text-white"
              style={{
                backgroundImage: cardBackgrounds[i],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                minHeight: '220px',
                border: 'none',
                cursor: i === 0 ? 'pointer' : 'default'
              }}
              onClick={() => handleCardClick(i)}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '0.5rem',
                  zIndex: 1
                }}
              />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="display-4">{item.icon}</div>
                <h5 className="mt-3">{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MidSection