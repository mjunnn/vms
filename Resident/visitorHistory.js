const express = require('express');
const router = express.Router();
const pool = require('../../db');

router.get('/api/visitor-logs', (req, res) => {
  // Retrieve visitor logs along with the visitor's name.
  const sql = `
    SELECT vl.id, v.name AS visitor_name, vl.check_in_time, vl.check_out_time, vl.status 
    FROM visitor_logs vl 
    JOIN visitors v ON vl.visitor_id = v.id 
    ORDER BY vl.check_in_time DESC
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching visitor logs:', err);
      return res.status(500).json({ message: 'Error fetching visitor logs' });
    }
    res.json({ logs: results });
  });
});

module.exports = router;
