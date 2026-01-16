const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  value: { type: Number, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  category: { type: String, required: true },
  result: { type: Number, required: true },
  meta: { type: Object, default: {} }
}, { timestamps: true });

// TTL: expire documents 30 days (30*24*60*60 = 2592000 seconds)
historySchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('History', historySchema);
