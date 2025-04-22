// frontend/src/pages/PreRegistration.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Resident/PreRegistration.css';

function PreRegistration() {
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setMessage('User not found. Please log in.');
      return;
    }

    axios
      .post('http://localhost:5000/api/pre-registration', {
        residentId: user.id,
        visitorName,
        visitorEmail,
        visitorPhone, // new field
        scheduledDate,
      })
      .then((response) => {
        setMessage('Pre-registration successful.');
        setVisitorName('');
        setVisitorEmail('');
        setVisitorPhone('');
        setScheduledDate('');
      })
      .catch((err) => {
        setMessage('Error during pre-registration.');
      });
  };

  return (
    <div className="pre-registration-container">
      <h3>Pre-Register Visitor</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Visitor Name"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Visitor Email"
          value={visitorEmail}
          onChange={(e) => setVisitorEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Visitor Phone"
          value={visitorPhone}
          onChange={(e) => setVisitorPhone(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          required
        />
        <button type="submit">Submit Pre-Registration</button>
      </form>
    </div>
  );
}

export default PreRegistration;
