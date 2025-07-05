import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => (
  <div className="home-container">
    <h1 className="home-title">Trello Clone</h1>
    <p className="home-subtitle">Collaborate, organize, and manage your tasks in real time.</p>
    <div className="home-actions">
      {localStorage.getItem('token') ? (
        <Link to="/board" className="home-btn">Get Started</Link>
      ) : (
        <Link to="/login" className="home-btn">Get Started</Link>
      )}
    </div>
    <div className="home-graphic">
      {/* Add a custom SVG or animation here for visual appeal */}
      <svg width="200" height="120" viewBox="0 0 200 120">
        <rect x="10" y="20" width="50" height="80" rx="10" fill="#61dafb" />
        <rect x="75" y="10" width="50" height="100" rx="10" fill="#21a1f3" />
        <rect x="140" y="30" width="50" height="70" rx="10" fill="#007acc" />
      </svg>
    </div>
  </div>
);

export default Home; 