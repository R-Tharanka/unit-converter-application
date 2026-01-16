const express = require('express');
const { convertHandler } = require('../controllers/convertController');
const validateConvert = require('../validators/convertValidator');
const History = require('../models/History');

const router = express.Router();

// Optional health check endpoint (useful for deployment monitoring)
// router.get('/health', (req, res) => {
//     res.json({ ok: true, uptime: process.uptime() });
// });

// Perform unit conversion with server-side validation
router.post('/convert', validateConvert, convertHandler);

// Fetch paginated conversion history (newest first)
router.get('/history', async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const docs = await History.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await History.countDocuments();
    res.json({ page, limit, total, data: docs });
});

// Clear all conversion history (confirmation required for safety)
router.delete('/history', async (req, res) => {
    const { confirm } = req.body;

    if (!confirm) {
        return res.status(400).json({ message: 'Confirmation required' });
    }

    const result = await History.deleteMany({});
    res.json({ deletedCount: result.deletedCount });
});

module.exports = router;
