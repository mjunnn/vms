// backend/routes/visitorTraffic.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Retrieve visitor traffic data from check_ins table
router.get('/api/visitor-traffic', (req, res) => {
  const sql = `
    SELECT ci.id, v.name AS visitor_name, ci.status, ci.check_in_time AS timestamp
    FROM check_ins ci
    JOIN visitors v ON ci.visitor_id = v.id
    ORDER BY ci.check_in_time DESC
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching visitor traffic:', err);
      return res
        .status(500)
        .json({ message: 'Error fetching visitor traffic.' });
    }
    res.json({ traffic: results });
  });
});

module.exports = router;
