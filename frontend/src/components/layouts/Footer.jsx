import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCloud, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <NavLink to="/" className="logo">
              <FaCloud className="cloud-icon" />
              <span>CloudVault</span>
            </NavLink>
            <p className="footer-description">
              Secure cloud storage solution for individuals and businesses. 
              Access your files anytime, anywhere.
            </p>
            <div className="social-links">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedinIn /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="links-column">
              <h3>Product</h3>
              <ul>
                <li><NavLink to="/features">Features</NavLink></li>
                <li><NavLink to="/pricing">Pricing</NavLink></li>
                <li><NavLink to="/security">Security</NavLink></li>
                <li><NavLink to="/integrations">Integrations</NavLink></li>
                <li><NavLink to="/updates">Updates</NavLink></li>
              </ul>
            </div>
            
            <div className="links-column">
              <h3>Company</h3>
              <ul>
                <li><NavLink to="/about">About Us</NavLink></li>
                <li><NavLink to="/careers">Careers</NavLink></li>
                <li><NavLink to="/blog">Blog</NavLink></li>
                <li><NavLink to="/press">Press</NavLink></li>
                <li><NavLink to="/partners">Partners</NavLink></li>
              </ul>
            </div>
            
            <div className="links-column">
              <h3>Support</h3>
              <ul>
                <li><NavLink to="/help">Help Center</NavLink></li>
                <li><NavLink to="/community">Community</NavLink></li>
                <li><NavLink to="/tutorials">Tutorials</NavLink></li>
                <li><NavLink to="/status">Status</NavLink></li>
                <li><NavLink to="/contact">Contact Us</NavLink></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} CloudVault. All rights reserved.
          </div>
          
          <div className="legal-links">
            <NavLink to="/privacy">Privacy Policy</NavLink>
            <NavLink to="/terms">Terms of Service</NavLink>
            <NavLink to="/cookies">Cookie Policy</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;