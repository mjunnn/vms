// backend/routes/verifyVisitor.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// GET pending visitor verifications
router.get('/api/verify-visitor', (req, res) => {
  const sql = `
    SELECT pr.id, v.name, v.email, pr.scheduled_date
    FROM pre_registrations pr
    JOIN visitors v ON pr.visitor_id = v.id
    WHERE pr.status = 'pending'
    ORDER BY pr.created_at DESC
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching visitor information:', err);
      return res
        .status(500)
        .json({ message: 'Error fetching visitor information.' });
    }
    res.json({ pendingVisitors: results });
  });
});

// POST endpoint to verify a visitor (update status to 'approved')
router.post('/api/verify-visitor/:id', (req, res) => {
  const { id } = req.params;
  const sql =
    "UPDATE pre_registrations SET status = 'approved' WHERE id = ? AND status = 'pending'";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error verifying visitor:', err);
      return res.status(500).json({ message: 'Error verifying visitor.' });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Visitor not found or already verified.' });
    }
    res.json({ message: 'Visitor verified successfully.' });
  });
});

module.exports = router;
