import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaCloud, FaBars, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    window.location.reload();
    Cookies.remove("token")

  }

  return (
    <header className="main-header">
      <div className="container">
        <div className="logo-container">
          <NavLink to="/" className="logo">
            <FaCloud className="cloud-icon" />
            <span>CloudVault</span>
          </NavLink>
        </div>
        
        <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li>
              <NavLink to="/" >Home</NavLink>
            </li>
            <li>
              <NavLink to="/images" >Images</NavLink>
            </li>
            <li>
              <NavLink to="/videos" >Videos</NavLink>
            </li>
            <li>
              <NavLink to="/audios" >Audios</NavLink>
            </li>
            <li>
              <NavLink to="/documents" >Documents</NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          <NavLink to="/upload" className="btn login-btn">Upload</NavLink>
          <button id='logout-btn' onClick={handleLogout}><NavLink to="/login" className="btn signup-btn">LogOut</NavLink></button>
        </div>
        
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Header;