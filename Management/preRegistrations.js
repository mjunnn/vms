// backend/routes/preRegistrations.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

router.get('/api/pre-registrations', (req, res) => {
  // Join pre_registrations with users (residents) and visitors to get resident and visitor names
  const sql = `
    SELECT pr.id, u.name AS resident_name, v.name AS visitor_name, pr.scheduled_date, pr.qr_code, pr.status, pr.created_at
    FROM pre_registrations pr
    JOIN users u ON pr.resident_id = u.id
    JOIN visitors v ON pr.visitor_id = v.id
    ORDER BY pr.scheduled_date DESC
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching pre-registrations:', err);
      return res
        .status(500)
        .json({ message: 'Error fetching pre-registrations' });
    }
    res.json({ preRegistrations: results });
  });
});

module.exports = router;
