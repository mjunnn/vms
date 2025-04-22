// frontend/src/pages/VerifyExit.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Security/VerifyExit.css';

function VerifyExit() {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = () => {
    axios
      .post('http://localhost:5000/api/visitor-qr-checkout', { qrCode })
      .then((response) => {
        setMessage('Visitor exit verified successfully.');
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message || 'Error verifying visitor exit.'
        );
      });
  };

  return (
    <div className="verify-exit-container">
      <h3>Verify Visitor Exit</h3>
      <input
        type="text"
        placeholder="Enter QR Code"
        value={qrCode}
        onChange={(e) => setQrCode(e.target.value)}
      />
      <button onClick={handleVerify}>Verify Exit</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VerifyExit;
