// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');
const bcrypt = require('bcrypt'); // or bcryptjs if you prefer

// Allowed roles for registration
const allowedRoles = ['management', 'resident', 'security'];

/**
 * Registration Endpoint
 * Expects: { name, email, password, role }
 */
router.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: 'Please provide name, email, password, and role' });
  }
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid user role' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const sql = `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`;
    pool.query(sql, [name, email, hashedPassword, role], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Registration failed' });
      }
      return res.status(200).json({ message: 'Registration successful' });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

/**
 * Login Endpoint
 * Expects: { email, password }
 */
router.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email and password' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  pool.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).json({ message: 'Login failed' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // Login successful: return basic user info
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return res.status(500).json({ message: 'Login failed' });
    }
  });
});

// Optional test route
router.get('/test', (req, res) => {
  res.send('Auth route is working!');
});

module.exports = router;
