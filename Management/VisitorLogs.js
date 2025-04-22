// frontend/src/pages/VisitorLogs.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Management/VisitorLogs.css';

function VisitorLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve logged-in user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Only allow management to access visitor logs
      if (parsedUser.role !== 'management') {
        setError('You are not authorized to view visitor logs.');
        setLoading(false);
        return;
      }
      // Fetch visitor logs from the API
      axios
        .get('http://localhost:5000/api/visitor-logs')
        .then((response) => {
          setLogs(response.data.logs);
          setLoading(false);
        })
        .catch((err) => {
          setError(
            err.response?.data?.message || 'Error fetching visitor logs'
          );
          setLoading(false);
        });
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading visitor logs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="visitor-logs-container">
      <h2>Visitor Logs</h2>
      {logs.length === 0 ? (
        <p>No visitor logs available.</p>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Check-In Time</th>
              <th>Check-Out Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.visitor_name}</td>
                <td>{new Date(log.check_in_time).toLocaleString()}</td>
                <td>
                  {log.check_out_time
                    ? new Date(log.check_out_time).toLocaleString()
                    : 'N/A'}
                </td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VisitorLogs;
