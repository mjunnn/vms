// frontend/src/pages/MassNotifications.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Management/MassNotifications.css';

function MassNotifications() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve logged-in user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Only allow management to send mass notifications
      if (parsedUser.role !== 'management') {
        setErrorMessage('You are not authorized to send mass notifications.');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSend = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!message.trim()) {
      setErrorMessage('Message cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/notifications/mass',
        { message }
      );
      setSuccessMessage(response.data.message);
      setMessage('');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Error sending notifications'
      );
    }
  };

  return (
    <div className="mass-notifications-container">
      <h2>Send Mass Notification</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSend}>
        <label htmlFor="notification-message">Notification Message</label>
        <textarea
          id="notification-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter notification message..."
          rows="6"
          required
        />
        <button type="submit" className="btn">
          Send Notification
        </button>
      </form>
    </div>
  );
}

export default MassNotifications;
