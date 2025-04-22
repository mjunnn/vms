// frontend/src/pages/CapacityLimits.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Management/CapacityLimits.css';

function CapacityLimits() {
  const [visitorLimit, setVisitorLimit] = useState(50);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/capacity-limits')
      .then((response) => {
        setVisitorLimit(response.data.visitorLimit);
      })
      .catch((err) => {
        setMessage('Error fetching capacity limit.');
      });
  }, []);

  const handleUpdateLimit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/capacity-limits', { visitorLimit })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message ||
            'Error updating visitor capacity limit.'
        );
      });
  };

  return (
    <div className="capacity-limits-container">
      <h3>Visitor Capacity Management</h3>
      {message && <p className="message">{message}</p>}
      <p>
        Visitor Capacity Limit: <strong>{visitorLimit}</strong>
      </p>

      <form onSubmit={handleUpdateLimit}>
        <label>Set New Capacity Limit:</label>
        <input
          type="number"
          value={visitorLimit}
          onChange={(e) => setVisitorLimit(e.target.value)}
          min="0"
          required
        />
        <button type="submit">Update Limit</button>
      </form>
    </div>
  );
}

export default CapacityLimits;
