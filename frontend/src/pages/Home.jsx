import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';

const Home = () => {
  const notifySucess = (message) => toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
    });

    useEffect(() => {
      notifySucess("Welcome to cloudVault !")
      }, [])
    
  return (
    <div className="home-page">
      {/* Hero Section Only */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Files, Safe in the Cloud</h1>
          <p className="hero-subtitle">
            Secure, reliable, and accessible from anywhere. 
            Get started with 15GB free storage today.
          </p>
        
        </div>
        <div className="hero-image">
          <img 
            src="background.webp" 
            alt="Cloud Storage Illustration"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;