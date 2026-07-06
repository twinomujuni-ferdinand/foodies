import React from 'react';
import Navbar from './NavBar';

const Header = ({ onNavClick, refs }) => (
  <Navbar onNavClick={onNavClick} refs={refs} />
);

export default Header;