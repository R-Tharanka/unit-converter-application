const express = require('express');
const { convertHandler } = require('../controllers/convertController');
const validateConvert = require('../middlewares/convertValidator');
const History = require('../models/History');
const { registerHandler, loginHandler } = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

// auth
router.post('/auth/register', registerHandler);
router.post('/auth/login', loginHandler);

// Optional health check endpoint (useful for deployment monitoring)
// router.get('/health', (req, res) => {
//     res.json({ ok: true, uptime: process.uptime() });
// });

// convert - allow anonymous conversion but require auth to save
router.post('/convert', validateConvert, (req, res, next) => {
  // if Authorization header present, let auth middleware attach req.user
  // otherwise continue as anonymous; convertHandler will enforce save behavior
  next();
}, convertHandler);

// get user's history (protected)
router.get('/history', auth, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const docs = await History.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await History.countDocuments({ userId: req.user.id });
  res.json({ page, limit, total, data: docs });
});

// delete user's history
router.delete('/history', auth, async (req, res) => {
  const { confirm } = req.body;
  if (!confirm) return res.status(400).json({ message: 'Confirmation required' });
  const r = await History.deleteMany({ userId: req.user.id });
  res.json({ deletedCount: r.deletedCount });
});
