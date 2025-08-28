const mongoose = require('mongoose');

const appMetricsSchema = new mongoose.Schema({
  totalRequests: {
    type: Number,
    default: 0
  },
  totalCalculations: {
    type: Number,
    default: 0
  },
  averageFare: {
    type: Number,
    default: 0
  },
  popularVehicleTypes: [{
    type: {
      type: String,
      enum: ['motorcycle', 'car']
    },
    count: {
      type: Number,
      default: 0
    }
  }],
  dailyStats: [{
    date: {
      type: Date,
      required: true
    },
    requests: {
      type: Number,
      default: 0
    },
    calculations: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AppMetrics', appMetricsSchema);
