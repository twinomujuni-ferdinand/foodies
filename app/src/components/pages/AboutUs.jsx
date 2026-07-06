/*const AboutUs = () => (
  <section id="about" className="container mt-5">
    <h2>About Us</h2>
    <p>This section contains information about our mission, team, and values.</p>
  </section>
);
export default AboutUs*/



import React from 'react';
import '../CssModule/AboutUs.css';//Import custom styles for About Us page

const AboutUs = () => {
  const team = [
    { name: 'Twinomujuni Ferdinand', role: 'Founder', img: '/coolferd.png' },
    { name: 'Linda', role: 'Marketing Lead', img: 'https://via.placeholder.com/150' },
    { name: 'James', role: 'Head Chef', img: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="about-us-wrapper" style={{
      backgroundImage: "url('/public/banner.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '60vh',
      width: '100%'
    }}>
      <div className="container py-5">
        <h1 className="about-title mb-4">About Us</h1>
        <p className="about-description mb-5">
          We are a passionate team crafting delightful web and food experiences with creativity and love.
        </p>
        <div className="row g-4">
          {team.map((person, i) => (
            <div className="col-md-4" key={i}>
              <div className="card  h-100 shadow text-center">
                <img src={person.img} className="card-img-top rounded-circle mx-auto mt-3 team-img" alt={person.name} style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title team-name">{person.name}</h5>
                  <p className="card-text team-role">{person.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
