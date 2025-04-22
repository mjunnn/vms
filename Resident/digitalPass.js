const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Retrieve QR code for a visitor
router.get('/api/digital-pass/:residentId', (req, res) => {
  const { residentId } = req.params;

  pool.query(
    'SELECT qr_code FROM pre_registrations WHERE resident_id = ? ORDER BY created_at DESC LIMIT 1',
    [residentId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      if (results.length === 0)
        return res.status(404).json({ message: 'No pre-registration found.' });

      const qrCode = results[0].qr_code;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}`;
      res.json({ qrCodeUrl });
    }
  );
});

module.exports = router;
