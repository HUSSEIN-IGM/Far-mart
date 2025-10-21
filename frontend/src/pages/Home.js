import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Farmart</h1>
            <p>Buy farm animals directly from farmers. No middlemen. Better prices.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Browse Animals</button>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Why Choose Farmart?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🚜 Direct from Farmers</h3>
              <p>Buy directly from trusted farmers without any middlemen taking commissions.</p>
            </div>
            <div className="feature-card">
              <h3>💰 Better Prices</h3>
              <p>Get competitive prices by eliminating unnecessary intermediaries.</p>
            </div>
            <div className="feature-card">
              <h3>🐄 Quality Animals</h3>
              <p>Access healthy, well-cared-for animals from reputable farms.</p>
            </div>
            <div className="feature-card">
              <h3>📱 Easy Platform</h3>
              <p>Simple and intuitive platform for both farmers and buyers.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Join thousands of farmers and buyers connecting directly.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Sign Up as Farmer</button>
            <button className="btn btn-secondary">Sign Up as Buyer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;