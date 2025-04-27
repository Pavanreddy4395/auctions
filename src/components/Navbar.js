import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">AuctionSystem</Link>
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <>
            <Link to="/">Dashboard</Link>
            <button onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"className="login">Login</Link>
            <Link to="/register" className="register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
