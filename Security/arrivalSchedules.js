// backend/routes/arrivalSchedules.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Retrieve upcoming visitor arrival schedules from pre_registrations
router.get('/api/arrival-schedules', (req, res) => {
  const sql = `
    SELECT pr.id, v.name AS visitor_name, pr.scheduled_date
    FROM pre_registrations pr
    JOIN visitors v ON pr.visitor_id = v.id
    WHERE pr.status IN ('approved', 'pending')
    ORDER BY pr.scheduled_date ASC
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching arrival schedules:', err);
      return res
        .status(500)
        .json({ message: 'Error fetching arrival schedules.' });
    }
    res.json({ schedules: results });
  });
});

module.exports = router;
