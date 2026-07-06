import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row text-center text-md-start">
          <div className="col-md-4 mb-3">
            <h5 className="text-warning">Our Location</h5>
            <p>
              Plot 12, Kira Road<br />
              Kampala, Uganda
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="text-warning">Contact Us</h5>
            <p>
              Phone: <a href="tel:+256770000000" className="text-light">+256 770 000000</a><br />
              Email: <a href="mailto:info@Foodies.com" className="text-light">info@foodies.com</a>
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="text-warning">Opening Hours</h5>
            <p>
              Mon – Sun: 9:00 AM – 11:00 PM
            </p>
          </div>
        </div>
        <hr className="bg-light" />
        <p className="text-center mb-0">&copy; {new Date().getFullYear()} Foodies. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
