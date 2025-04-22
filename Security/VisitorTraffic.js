// frontend/src/pages/VisitorTraffic.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Security/VisitorTraffic.css';

function VisitorTraffic() {
  const [trafficData, setTrafficData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/visitor-traffic')
      .then((response) => {
        setTrafficData(response.data.traffic);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Error fetching visitor traffic.'
        );
      });
  }, []);

  return (
    <div className="visitor-traffic-container">
      <h3>Monitor Visitor Traffic</h3>
      {error && <p className="error-message">{error}</p>}
      {trafficData.length === 0 ? (
        <p>No visitor traffic data available.</p>
      ) : (
        <ul className="traffic-list">
          {trafficData.map((item, index) => (
            <li key={index}>
              {item.visitor_name} - {item.status} at{' '}
              {new Date(item.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VisitorTraffic;
