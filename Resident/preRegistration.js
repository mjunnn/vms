// backend/routes/preRegistration.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Function to generate a 4-digit random string, e.g., "0123" or "9876"
function generateFourDigitQR() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

router.post('/api/pre-registration', (req, res) => {
  const { residentId, visitorName, visitorEmail, visitorPhone, scheduledDate } =
    req.body;
  if (
    !residentId ||
    !visitorName ||
    !visitorEmail ||
    !scheduledDate ||
    !visitorPhone
  ) {
    return res
      .status(400)
      .json({ message: 'All required fields must be provided.' });
  }

  const qrCode = generateFourDigitQR();

  // Check if visitor exists by email
  pool.query(
    'SELECT id FROM visitors WHERE email = ?',
    [visitorEmail],
    (err, visitorResults) => {
      if (err) {
        console.error('Error checking visitor:', err);
        return res
          .status(500)
          .json({ message: 'Error during pre-registration.' });
      }
      let visitorId;
      if (visitorResults.length > 0) {
        visitorId = visitorResults[0].id;
        insertPreRegistration(visitorId);
      } else {
        // Insert new visitor record with name, email, and phone
        pool.query(
          'INSERT INTO visitors (name, email, phone) VALUES (?, ?, ?)',
          [visitorName, visitorEmail, visitorPhone],
          (err, insertResult) => {
            if (err) {
              console.error('Error inserting visitor:', err);
              return res
                .status(500)
                .json({ message: 'Error during pre-registration.' });
            }
            visitorId = insertResult.insertId;
            insertPreRegistration(visitorId);
          }
        );
      }
    }
  );

  function insertPreRegistration(visitorId) {
    pool.query(
      "INSERT INTO pre_registrations (resident_id, visitor_id, scheduled_date, qr_code, status) VALUES (?, ?, ?, ?, 'pending')",
      [residentId, visitorId, scheduledDate, qrCode],
      (err) => {
        if (err) {
          console.error('Error inserting pre-registration:', err);
          return res
            .status(500)
            .json({ message: 'Error during pre-registration.' });
        }
        res.json({ message: 'Pre-registration successful.', qrCode });
      }
    );
  }
});

module.exports = router;
