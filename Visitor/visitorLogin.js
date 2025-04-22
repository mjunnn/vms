// backend/routes/visitorLogin.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

router.post('/api/visitor-login', (req, res) => {
  const { email, phone } = req.body;
  console.log('Visitor login attempt with:', { email, phone }); // Debug logging

  if (!email || !phone) {
    return res.status(400).json({ message: 'Email and phone are required.' });
  }

  const sql = 'SELECT * FROM visitors WHERE email = ? AND phone = ?';
  pool.query(sql, [email, phone], (err, results) => {
    if (err) {
      console.error('Error verifying visitor:', err);
      return res.status(500).json({ message: 'Error verifying visitor.' });
    }
    if (results.length === 0) {
      console.log('No matching visitor found for:', { email, phone });
      return res
        .status(404)
        .json({ message: 'Visitor not found. Please contact your resident.' });
    }
    res.json({ visitor: results[0] });
  });
});

module.exports = router;
