import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Resident/DigitalVisitorPass.css';

function DigitalVisitorPass() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleGenerate = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setMessage('User not found. Please log in.');
      return;
    }

    axios
      .get(`http://localhost:5000/api/digital-pass/${user.id}`)
      .then((response) => {
        setQrCodeUrl(response.data.qrCodeUrl);
        setMessage('QR code generated successfully.');
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Error generating QR code.');
      });
  };

  return (
    <div>
      <h3>Digital Visitor Pass</h3>
      <button onClick={handleGenerate}>Generate QR Code</button>
      {message && <p>{message}</p>}
      {qrCodeUrl && <img src={qrCodeUrl} alt="Digital Visitor Pass" />}
    </div>
  );
}

export default DigitalVisitorPass;
