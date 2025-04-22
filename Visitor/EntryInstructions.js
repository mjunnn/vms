// frontend/src/pages/EntryInstructions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Visitor/EntryInstructions.css';

function EntryInstructions() {
  const [policy, setPolicy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/security-policies')
      .then((response) => {
        setPolicy(
          response.data.policy
            ? response.data.policy.policy_text
            : 'No entry instructions available.'
        );
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Error fetching entry instructions.'
        );
      });
  }, []);

  return (
    <div className="entry-instructions-container">
      <h3>Entry Instructions</h3>
      {error ? <p className="error-message">{error}</p> : <p>{policy}</p>}
    </div>
  );
}

export default EntryInstructions;
