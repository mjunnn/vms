// backend/routes/visitorQRCheckIn.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

router.post('/api/visitor-qr-checkin', (req, res) => {
  const { qrCode } = req.body;
  if (!qrCode) {
    return res.status(400).json({ message: 'QR Code is required.' });
  }

  // First, update pre_registrations status to 'checked_in'
  const updateSql =
    "UPDATE pre_registrations SET status = 'checked_in' WHERE qr_code = ?";
  pool.query(updateSql, [qrCode], (err, result) => {
    if (err) {
      console.error('Error during QR check-in:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'QR Code not found.' });
    }

    // Then, insert a record into visitor_logs for check-in.
    // Here, we insert values for visitor_id, action, and status.
    const insertSql = `
      INSERT INTO visitor_logs (visitor_id, action, status)
      SELECT visitor_id, 'Checked In', 'Checked In'
      FROM pre_registrations 
      WHERE qr_code = ?`;
    pool.query(insertSql, [qrCode], (err2, result2) => {
      if (err2) {
        console.error('Error inserting visitor log:', err2);
        return res
          .status(500)
          .json({ message: 'Error logging visitor check-in.' });
      }
      res.json({ message: 'Visitor checked in successfully.' });
    });
  });
});

module.exports = router;
