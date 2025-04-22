const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Submit resident feedback
router.post('/api/feedback', (req, res) => {
  const { residentId, message } = req.body;

  if (!residentId || !message) {
    return res
      .status(400)
      .json({ message: 'Resident ID and feedback message are required.' });
  }

  pool.query(
    'INSERT INTO feedback (resident_id, message) VALUES (?, ?)',
    [residentId, message],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error.' });

      res.json({ message: 'Feedback submitted successfully.' });
    }
  );
});

module.exports = router;
