import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <Link to="/" className="logo">AuctionSystem</Link>
        <div className="nav-buttons">
          <Link to="/login">Login</Link>
          <Link to="/register" className="register">Register</Link>
        </div>
      </header>

      <main className="homepage-main">
        <h1>Welcome to AuctionSystem</h1>
        <p>Your trusted platform for real-time, secure, and scalable online auctions.</p>

        <div className="features">
          <div className="feature-card">📄 Product Catalog</div>
          <div className="feature-card">🔐 Secure Transactions</div>
          <div className="feature-card">📊 Real-Time Bidding</div>
          <div className="feature-card">📁 Document Vault</div>
          <div className="feature-card">⏱ Auction Timer</div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
