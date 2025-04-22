const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Get visitor status for a resident
router.get('/api/visitor-status/:residentId', (req, res) => {
  const { residentId } = req.params;

  const sql = `
    SELECT 
      v.name AS visitorName, 
      v.email, 
      v.phone, 
      pr.status 
    FROM pre_registrations pr
    JOIN visitors v ON pr.visitor_id = v.id
    WHERE pr.resident_id = ? 
    ORDER BY pr.created_at DESC 
    LIMIT 1
  `;

  pool.query(sql, [residentId], (err, results) => {
    if (err) {
      console.error('Error fetching visitor status:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No visitor found.' });
    }

    // Debug log to inspect raw data from the query
    console.log('Fetched visitor record:', results[0]);

    res.json({ visitor: results[0] });
  });
});

module.exports = router;
