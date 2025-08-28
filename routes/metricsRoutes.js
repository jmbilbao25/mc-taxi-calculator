const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

// GET /api/metrics
router.get('/metrics', metricsController.getMetrics);

module.exports = router;
