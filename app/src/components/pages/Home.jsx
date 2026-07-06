


// Vite + React + Bootstrap Starter App
// Assuming Bootstrap is already installed (via npm or CDN in index.html)

import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Header from './Header';
import HomePage from './HomePage';
import AboutUs from './AboutUs';
import Career from './Career';
import Menu from './Menu';
import Footer from './Footer';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Routes ,Route, useNavigate} from 'react-router-dom';


const Home = ({ onNavClick, refs = {} }) => {
  const { homeRef, aboutUsRef, careerRef, menuRef } = refs;
  return (
    <>
      <div ref={homeRef}>
        <HomePage menuRef={menuRef} />
      </div>
      <div ref={aboutUsRef}>
        <AboutUs />
      </div>
      <div ref={careerRef}>
        <Career />
      </div>
      <Footer />
    </>
  );
};

export default Home








