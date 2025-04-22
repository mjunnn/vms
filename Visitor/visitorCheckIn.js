// backend/routes/visitorCheckIn.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

router.post('/api/visitor-checkin', (req, res) => {
  const { visitorName, visitorEmail, visitorPhone } = req.body;
  if (!visitorName || !visitorEmail || !visitorPhone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  // Update the visitor record if exists, or insert a new one.
  pool.query(
    'SELECT id FROM visitors WHERE email = ?',
    [visitorEmail],
    (err, results) => {
      if (err) {
        console.error('Error checking visitor:', err);
        return res.status(500).json({ message: 'Database error.' });
      }
      if (results.length > 0) {
        // Update visitor details
        const visitorId = results[0].id;
        pool.query(
          'UPDATE visitors SET name = ?, phone = ? WHERE id = ?',
          [visitorName, visitorPhone, visitorId],
          (err) => {
            if (err) {
              console.error('Error updating visitor:', err);
              return res.status(500).json({ message: 'Database error.' });
            }
            res.json({ message: 'Check-in form updated successfully.' });
          }
        );
      } else {
        // Insert new visitor record
        pool.query(
          'INSERT INTO visitors (name, email, phone) VALUES (?, ?, ?)',
          [visitorName, visitorEmail, visitorPhone],
          (err) => {
            if (err) {
              console.error('Error inserting visitor:', err);
              return res.status(500).json({ message: 'Database error.' });
            }
            res.json({ message: 'Check-in form submitted successfully.' });
          }
        );
      }
    }
  );
});

module.exports = router;
