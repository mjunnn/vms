// frontend/src/pages/VerifyVisitor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Security/VerifyVisitor.css';

function VerifyVisitor() {
  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Function to fetch pending visitors
  const fetchPendingVisitors = () => {
    axios
      .get('http://localhost:5000/api/verify-visitor')
      .then((response) => {
        setPendingVisitors(response.data.pendingVisitors);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Error fetching visitor information.'
        );
      });
  };

  useEffect(() => {
    fetchPendingVisitors();
  }, []);

  // Handler for the Verify button click
  const handleVerify = (id) => {
    axios
      .post(`http://localhost:5000/api/verify-visitor/${id}`)
      .then((response) => {
        setMessage(response.data.message);
        // Refresh the pending visitors list after successful verification
        fetchPendingVisitors();
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error verifying visitor.');
      });
  };

  return (
    <div className="verify-visitor-container">
      <h3>Verify Visitor Information</h3>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      {pendingVisitors.length === 0 ? (
        <p>No pending visitor verifications.</p>
      ) : (
        <table className="visitor-table">
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Email</th>
              <th>Scheduled Arrival</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingVisitors.map((visitor) => (
              <tr key={visitor.id}>
                <td>{visitor.name}</td>
                <td>{visitor.email}</td>
                <td>{new Date(visitor.scheduled_date).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleVerify(visitor.id)}>
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VerifyVisitor;
