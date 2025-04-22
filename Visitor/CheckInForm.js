// frontend/src/pages/CheckInForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Visitor/CheckInForm.css';

function CheckInForm() {
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/visitor-checkin', {
        visitorName,
        visitorEmail,
        visitorPhone,
      })
      .then((response) => {
        setMessage('Check-in form submitted successfully.');
        setVisitorName('');
        setVisitorEmail('');
        setVisitorPhone('');
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message || 'Error submitting check-in form.'
        );
      });
  };

  return (
    <div className="checkin-form-container">
      <h3>Pre-Fill Check-In Form</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={visitorEmail}
          onChange={(e) => setVisitorEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Phone"
          value={visitorPhone}
          onChange={(e) => setVisitorPhone(e.target.value)}
          required
        />
        <button type="submit">Submit Check-In Form</button>
      </form>
    </div>
  );
}

export default CheckInForm;
