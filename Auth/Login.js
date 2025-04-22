// frontend/src/pages/Login.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth/Auth.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if a success message was passed via state (e.g., after registration)
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear state so the message does not persist on further navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make the API call to login
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      // The API is expected to return a user object containing at least id, name, email, and role
      const user = response.data.user;
      // Save the user data (including role) to localStorage for use in the dashboard
      localStorage.setItem('user', JSON.stringify(user));
      // Redirect to the dashboard where role-based features are rendered
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>
        <p>
          You are a visitor? <a href="/visitor-entry">Click here</a>
        </p>
      </div>
      <div className="auth-image-container">
        {/* Update the src path to your desired image */}
        <img src="/images/auth-image.jpg" alt="Authentication Visual" />
      </div>
    </div>
  );
}

export default Login;
