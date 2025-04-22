// frontend/src/pages/CheckInQR.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Visitor/CheckInQR.css';

function CheckInQR() {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckIn = () => {
    axios
      .post('http://localhost:5000/api/visitor-qr-checkin', { qrCode })
      .then((response) => {
        setMessage('Check-in successful.');
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Error during check-in.');
      });
  };

  return (
    <div className="checkin-qr-container">
      <h3>Check-In using QR Code</h3>
      <input
        type="text"
        placeholder="Enter QR Code"
        value={qrCode}
        onChange={(e) => setQrCode(e.target.value)}
      />
      <button onClick={handleCheckIn}>Check In</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CheckInQR;
