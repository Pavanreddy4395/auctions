import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css'; // make sure the path is correct

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    setMessage('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password
      });
      setMessage(res.data); // success message from backend
    } catch (err) {
      setMessage('Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        {message && (
          <p style={{ color: message.includes('success') ? 'green' : 'red', textAlign: 'center' }}>
            {message}
          </p>
        )}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          type="email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
        />
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Register;
