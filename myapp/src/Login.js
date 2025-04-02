import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Define default username and password
  const DEFAULT_USERNAME = 'admin';
  const DEFAULT_PASSWORD = 'password123'; // Change this to your preferred default password

  const handleLogin = () => {
    if (!username || !password || !phoneNumber) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    // Check if the entered credentials match the defaults
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      // Call login success callback with phone number
      onLoginSuccess(phoneNumber);
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Wildlife Detection System</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Login;
