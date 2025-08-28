const mongoose = require('mongoose');

const fareCalculationSchema = new mongoose.Schema({
  distance: {
    type: Number,
    required: true,
    min: 0
  },
  baseFare: {
    type: Number,
    required: true,
    min: 0
  },
  perKmRate: {
    type: Number,
    required: true,
    min: 0
  },
  totalFare: {
    type: Number,
    required: true,
    min: 0
  },
  vehicleType: {
    type: String,
    enum: ['motorcycle', 'car'],
    default: 'motorcycle'
  },
  fareBreakdown: {
    type: String,
    required: true
  },
  tierDetails: {
    tier1: {
      range: String,
      rate: Number,
      amount: Number
    },
    tier2: {
      range: String,
      rate: Number,
      amount: Number
    },
    tier3: {
      range: String,
      rate: Number,
      amount: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  clientId: {
    type: String,
    default: 'anonymous'
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    location: {
      lat: Number,
      lng: Number
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
fareCalculationSchema.index({ timestamp: -1 });
fareCalculationSchema.index({ clientId: 1 });
fareCalculationSchema.index({ vehicleType: 1 });

module.exports = mongoose.model('FareCalculation', fareCalculationSchema);
