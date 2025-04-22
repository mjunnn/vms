// frontend/src/pages/SecurityPolicies.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Management/SecurityPolicies.css';

function SecurityPolicies() {
  const navigate = useNavigate();
  const [policy, setPolicy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve logged-in user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Only allow management to view/update security policies
      if (parsedUser.role !== 'management') {
        setError('You are not authorized to view security policies.');
        setLoading(false);
        return;
      }
      // Fetch current security policy from the API
      axios
        .get('http://localhost:5000/api/security-policies')
        .then((response) => {
          setPolicy(response.data.policy?.policy_text || '');
          setLoading(false);
        })
        .catch((err) => {
          setError(
            err.response?.data?.message || 'Error fetching security policy'
          );
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    axios
      .put('http://localhost:5000/api/security-policies', {
        policy_text: policy,
      })
      .then((response) => {
        setSuccessMessage('Security policy updated successfully.');
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Error updating security policy'
        );
      });
  };

  if (loading) {
    return <div>Loading security policy...</div>;
  }

  return (
    <div className="security-policies-container">
      <h2>Security Policies</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleUpdate}>
        <label htmlFor="policy">Policy Text</label>
        <textarea
          id="policy"
          value={policy}
          onChange={(e) => setPolicy(e.target.value)}
          rows="10"
          placeholder="Enter security policies here..."
        />
        <button type="submit" className="btn">
          Update Policy
        </button>
      </form>
    </div>
  );
}

export default SecurityPolicies;
