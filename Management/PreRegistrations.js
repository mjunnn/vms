// frontend/src/pages/PreRegistrations.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Management/PreRegistrations.css';

function PreRegistrations() {
  const navigate = useNavigate();
  const [preRegistrations, setPreRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve logged-in user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Only allow management to access pre-registrations
      if (parsedUser.role !== 'management') {
        setError('You are not authorized to view pre-registrations.');
        setLoading(false);
        return;
      }
      // Fetch pre-registration data from the API
      axios
        .get('http://localhost:5000/api/pre-registrations')
        .then((response) => {
          setPreRegistrations(response.data.preRegistrations);
          setLoading(false);
        })
        .catch((err) => {
          setError(
            err.response?.data?.message || 'Error fetching pre-registrations'
          );
          setLoading(false);
        });
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading pre-registrations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="pre-registrations-container">
      <h2>Pre-Registrations</h2>
      {preRegistrations.length === 0 ? (
        <p>No pre-registrations available.</p>
      ) : (
        <table className="registrations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Resident Name</th>
              <th>Visitor Name</th>
              <th>Scheduled Date</th>
              <th>QR Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {preRegistrations.map((reg) => (
              <tr key={reg.id}>
                <td>{reg.id}</td>
                <td>{reg.resident_name}</td>
                <td>{reg.visitor_name}</td>
                <td>{new Date(reg.scheduled_date).toLocaleString()}</td>
                <td>{reg.qr_code}</td>
                <td>{reg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PreRegistrations;
