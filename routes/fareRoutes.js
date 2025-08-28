const express = require('express');
const router = express.Router();
const fareController = require('../controllers/fareController');
const validateFareRequest = require('../middleware/validateFareRequest');

// POST /api/calculate-fare
router.post('/calculate-fare', validateFareRequest, fareController.calculateFare);

// GET /api/fare-history
router.get('/fare-history', fareController.getFareHistory);

module.exports = router;
