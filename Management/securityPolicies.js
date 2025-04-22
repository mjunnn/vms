// backend/routes/securityPolicies.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// GET current security policy (we assume a single policy record)
router.get('/api/security-policies', (req, res) => {
  const sql =
    'SELECT * FROM security_policies ORDER BY last_updated DESC LIMIT 1';
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching security policies:', err);
      return res
        .status(500)
        .json({ message: 'Error fetching security policies' });
    }
    res.json({ policy: results[0] });
  });
});

// UPDATE security policy
router.put('/api/security-policies', (req, res) => {
  const { policy_text } = req.body;
  if (!policy_text) {
    return res.status(400).json({ message: 'Policy text is required' });
  }

  // Update the policy record with id = 1 (or insert if not exists)
  const updateSql = 'UPDATE security_policies SET policy_text = ? WHERE id = 1';
  pool.query(updateSql, [policy_text], (err, result) => {
    if (err) {
      console.error('Error updating security policies:', err);
      return res
        .status(500)
        .json({ message: 'Error updating security policies' });
    }
    if (result.affectedRows === 0) {
      // No row with id 1 exists, insert a new record with id = 1
      const insertSql =
        'INSERT INTO security_policies (id, policy_text) VALUES (1, ?)';
      pool.query(insertSql, [policy_text], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting security policies:', insertErr);
          return res
            .status(500)
            .json({ message: 'Error updating security policies' });
        }
        return res.json({
          message: 'Security policy updated',
          policy: { id: 1, policy_text },
        });
      });
    } else {
      return res.json({
        message: 'Security policy updated',
        policy: { id: 1, policy_text },
      });
    }
  });
});

module.exports = router;
