import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Feedback.css';

function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setMessage('User not found. Please log in.');
      return;
    }

    axios
      .post('http://localhost:5000/api/feedback', {
        residentId: user.id,
        message: feedback,
      })
      .then((response) => {
        setMessage('Feedback submitted successfully.');
        setFeedback('');
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Error submitting feedback.');
      });
  };

  return (
    <div>
      <h3>Submit Complaint/Feedback</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback or complaint"
          required
        ></textarea>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

export default Feedback;
