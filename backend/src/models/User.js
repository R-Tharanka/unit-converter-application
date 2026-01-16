// src/models/User.js
const mongoose = require('mongoose');

/**
 * User schema
 * - Minimal fieldst: email and hashed password.
 * - `timestamps` gives createdAt/updatedAt automatically.
 */
const userSchema = new mongoose.Schema({
  // stored in lowercase to make lookups consistent
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  // store the hashed password (never store plain text)
  password: { type: String, required: true }, // hashed
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
