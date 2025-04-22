// frontend/src/pages/ArrivalSchedules.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Security/ArrivalSchedules.css';

function ArrivalSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/arrival-schedules')
      .then((response) => {
        setSchedules(response.data.schedules);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Error fetching arrival schedules.'
        );
      });
  }, []);

  return (
    <div className="arrival-schedules-container">
      <h3>Visitor Arrival Schedules</h3>
      {error && <p className="error-message">{error}</p>}
      {schedules.length === 0 ? (
        <p>No arrival schedules available.</p>
      ) : (
        <table className="schedules-table">
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Scheduled Arrival</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((item) => (
              <tr key={item.id}>
                <td>{item.visitor_name}</td>
                <td>{new Date(item.scheduled_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ArrivalSchedules;
