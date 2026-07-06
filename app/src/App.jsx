// Example: c:\Users\lorddiamond\Desktop\ride\app\src\App.jsx
import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/pages/Home';
import LoginRegistration from './components/pages/loginRegistration';
import Menu from './components/pages/Menu';
import Navbar from './components/pages/NavBar';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  // Get current location and background location for modal logic
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state && state.backgroundLocation;

  // Section refs for scroll-to-section
  const homeRef = useRef(null);
  const aboutUsRef = useRef(null);
  const careerRef = useRef(null);
  const menuRef = useRef(null);

  // User state
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setUser(null);
    window.location.href = '/'; // Redirect to home
  };

  const scrollToSection = (ref) => {
    ref?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const refs = { homeRef, aboutUsRef, careerRef, menuRef };

  return (
    <>
      <Navbar onNavClick={scrollToSection} refs={refs} user={user} onLogout={handleLogout} />
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home onNavClick={scrollToSection} refs={refs} />} />
        <Route path="/login" element={<LoginRegistration setUser={setUser} />} />
        <Route path="/menu" element={
          <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
            <Menu />
          </PayPalScriptProvider>
        } />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
