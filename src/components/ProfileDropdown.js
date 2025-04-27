import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';

const ProfileDropdown = () => {
  const [showProfile, setShowProfile] = useState(false);
  const token = localStorage.getItem('token');
  let userEmail = 'guest';

  if (token) {
    try {
      const decoded = jwt_decode(token);
      userEmail = decoded.sub || decoded.email || 'user';
    } catch (e) {
      console.error("Token decoding failed", e);
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#c7d2fe',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#1f2937',
        }}
        onClick={() => setShowProfile(prev => !prev)}
      >
        {userEmail.charAt(0).toUpperCase()}
      </div>

      {showProfile && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '50px',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '180px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          zIndex: 10,
        }}>
          <div style={{ padding: '8px 12px' }}>👤 {userEmail}</div>
          <hr />
          <button
            style={{
              padding: '8px 12px',
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
            }}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
