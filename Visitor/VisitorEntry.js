// frontend/src/pages/VisitorEntry.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Visitor/VisitorEntry.css';

function VisitorEntry() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/visitor-login', { email, phone })
      .then((response) => {
        localStorage.setItem('visitor', JSON.stringify(response.data.visitor));
        navigate('/visitor-dashboard');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error verifying visitor.');
      });
  };

  return (
    <div className="visitor-entry-container">
      <h2>Visitor Check-In</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Proceed</button>
      </form>
      <div className="alternate-logins">
        <p>Not a visitor?</p>
        <p>
          If you are an <Link to="/login">Admin/Resident</Link>, please log in
          here.
        </p>
      </div>
    </div>
  );
}

export default VisitorEntry;
