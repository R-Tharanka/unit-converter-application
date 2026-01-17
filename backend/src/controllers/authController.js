// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * registerHandler
 * - Validates input, prevents duplicate emails
 * - Hashes the password with bcrypt and creates a new user
 * - Returns a JWT for client use
 */
async function registerHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10); // salt rounds = 10 (reasonable default)
    const user = await User.create({ email, password: hashed });

    // create a JWT payload so the client can authenticate future requests
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // return token + basic user info (never return password)
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
}

/**
 * loginHandler
 * - Checks credentials, compares hashed password
 * - On success returns a JWT for the client to store (localStorage/cookie)
 */
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
}

module.exports = { registerHandler, loginHandler };
