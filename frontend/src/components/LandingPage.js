import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-logo">
        {/* Replace with your logo image if needed */}
        <h1>Temple Donation</h1>
      </div>
      <div className="landing-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Signup</Link>
      </div>
    </div>
  );
};

export default LandingPage;
