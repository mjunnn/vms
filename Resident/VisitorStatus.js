import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Resident/VisitorStatus.css';

function VisitorStatus() {
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('User not found. Please log in.');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/visitor-status/${user.id}`)
      .then((response) => {
        setVisitor(response.data.visitor);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Error fetching visitor status.'
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading visitor status...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="visitor-status-container">
      <h3>Visitor Status</h3>
      <p>
        <strong>Name:</strong> {visitor.visitorName}
      </p>
      <p>
        <strong>Email:</strong> {visitor.email || 'N/A'}
      </p>
      <p>
        <strong>Phone:</strong> {visitor.phone || 'N/A'}
      </p>
      <p>
        <strong>Status:</strong> {visitor.status}
      </p>
    </div>
  );
}

export default VisitorStatus;
