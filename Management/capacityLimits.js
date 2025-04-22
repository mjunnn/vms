// backend/routes/capacityLimits.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// GET current capacity limit
router.get('/api/capacity-limits', (req, res) => {
  const sql = 'SELECT * FROM visitor_capacity WHERE id = 1';
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching capacity limits:', err);
      return res
        .status(500)
        .json({ message: 'Error fetching capacity limits.' });
    }
    const currentLimit = results.length > 0 ? results[0].visitor_limit : null;
    res.json({ visitorLimit: currentLimit });
  });
});

// POST endpoint to update the capacity limit
router.post('/api/capacity-limits', (req, res) => {
  let { visitorLimit } = req.body;
  visitorLimit = parseInt(visitorLimit, 10);
  if (isNaN(visitorLimit) || visitorLimit < 0) {
    return res.status(400).json({ message: 'Invalid visitor limit value.' });
  }
  // Explicitly update the record with id = 1
  const sql = 'UPDATE visitor_capacity SET visitor_limit = ? WHERE id = 1';
  pool.query(sql, [visitorLimit], (err, result) => {
    if (err) {
      console.error('Error updating visitor capacity limit:', err);
      return res
        .status(500)
        .json({ message: 'Error updating visitor capacity limit.' });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'No capacity limit record found.' });
    }
    res.json({ message: 'Visitor capacity limit updated successfully.' });
  });
});

module.exports = router;
