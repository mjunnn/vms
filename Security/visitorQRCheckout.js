// backend/routes/visitorQRCheckout.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

router.post('/api/visitor-qr-checkout', (req, res) => {
  const { qrCode } = req.body;
  if (!qrCode) {
    return res.status(400).json({ message: 'QR Code is required.' });
  }

  // Get the visitor_id based on the QR Code
  const getVisitorIdSql =
    'SELECT visitor_id FROM pre_registrations WHERE qr_code = ?';

  pool.query(getVisitorIdSql, [qrCode], (err, results) => {
    if (err) {
      console.error('Error fetching visitor:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'QR Code not found.' });
    }

    const visitorId = results[0].visitor_id;

    // Update visitor_logs to set check_out_time where visitor_id matches
    const updateLogSql = `
      UPDATE visitor_logs 
      SET check_out_time = NOW(), status = 'Checked Out'
      WHERE visitor_id = ? AND check_out_time IS NULL
    `;

    pool.query(updateLogSql, [visitorId], (err2, result2) => {
      if (err2) {
        console.error('Error updating visitor log:', err2);
        return res
          .status(500)
          .json({ message: 'Error logging visitor checkout.' });
      }

      if (result2.affectedRows === 0) {
        // If no existing log entry is found, insert a new log entry
        const insertSql = `
          INSERT INTO visitor_logs (visitor_id, action, status, check_out_time)
          VALUES (?, 'Checked Out', 'Checked Out', NOW())
        `;
        pool.query(insertSql, [visitorId], (err3, result3) => {
          if (err3) {
            console.error('Error inserting visitor log (checkout):', err3);
            return res
              .status(500)
              .json({ message: 'Error logging visitor checkout.' });
          }
          return res.json({ message: 'Visitor checked out successfully.' });
        });
      } else {
        return res.json({ message: 'Visitor checked out successfully.' });
      }
    });
  });
});

module.exports = router;
