// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// POST endpoint for sending mass notifications
router.post('/api/notifications/mass', (req, res) => {
  const { message } = req.body;

  // Validate that a message is provided
  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // (Optional) Here you could check the logged-in user's role from a middleware
  // For demonstration, we assume only management calls this endpoint.

  // Retrieve all user IDs from the users table
  const getUsersSQL = 'SELECT id FROM users';
  pool.query(getUsersSQL, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error sending notifications' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'No users found' });
    }

    // Prepare bulk insert values: each row is [user_id, message]
    const values = results.map((row) => [row.id, message]);
    const insertSQL = 'INSERT INTO notifications (user_id, message) VALUES ?';

    pool.query(insertSQL, [values], (err, insertResults) => {
      if (err) {
        console.error('Error inserting notifications:', err);
        return res.status(500).json({ message: 'Error sending notifications' });
      }
      res.json({
        message: 'Mass notifications sent successfully',
        inserted: insertResults.affectedRows,
      });
    });
  });
});

module.exports = router;
