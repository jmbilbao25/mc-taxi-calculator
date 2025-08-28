const AppMetrics = require('../models/AppMetrics');
const FareCalculation = require('../models/FareCalculation');

const metricsController = {
  getMetrics: async (req, res) => {
    try {
      const { period = '7d' } = req.query;

      // Get or create metrics document
      let metrics = await AppMetrics.findOne();
      if (!metrics) {
        metrics = new AppMetrics();
        await metrics.save();
      }

      // Calculate additional metrics based on period
      const periodMs = getPeriodInMs(period);
      const startDate = new Date(Date.now() - periodMs);

      let periodStats = [];
      try {
        periodStats = await FareCalculation.aggregate([
          {
            $match: {
              timestamp: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: null,
              totalCalculations: { $sum: 1 },
              averageFare: { $avg: '$totalFare' },
              totalRevenue: { $sum: '$totalFare' },
              uniqueClients: { $addToSet: '$clientId' },
              vehicleTypeBreakdown: {
                $push: '$vehicleType'
              }
            }
          }
        ]);
      } catch (aggregateError) {
        console.error('Aggregation error:', aggregateError);
        // Continue with empty stats if aggregation fails
      }

      // Vehicle type breakdown for the period
      const vehicleBreakdown = {};
      if (periodStats.length > 0) {
        periodStats[0].vehicleTypeBreakdown.forEach(type => {
          vehicleBreakdown[type] = (vehicleBreakdown[type] || 0) + 1;
        });
      }

      // Hourly distribution for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let hourlyStats = [];
      try {
        hourlyStats = await FareCalculation.aggregate([
          {
            $match: {
              timestamp: { $gte: today }
            }
          },
          {
            $group: {
              _id: { $hour: '$timestamp' },
              count: { $sum: 1 },
              revenue: { $sum: '$totalFare' }
            }
          },
          { $sort: { '_id': 1 } }
        ]);
      } catch (hourlyError) {
        console.error('Hourly aggregation error:', hourlyError);
        // Continue with empty hourly stats if aggregation fails
      }

      const response = {
        success: true,
        data: {
          overview: {
            totalCalculations: metrics.totalCalculations || 0,
            totalRequests: metrics.totalRequests || 0,
            averageFare: parseFloat((metrics.averageFare || 0).toFixed(2)),
            lastUpdated: metrics.lastUpdated || new Date()
          },
          period: {
            duration: period,
            calculations: periodStats.length > 0 ? periodStats[0].totalCalculations : 0,
            averageFare: periodStats.length > 0 ? 
              parseFloat(periodStats[0].averageFare.toFixed(2)) : 0,
            totalRevenue: periodStats.length > 0 ? 
              parseFloat(periodStats[0].totalRevenue.toFixed(2)) : 0,
            uniqueClients: periodStats.length > 0 ? 
              periodStats[0].uniqueClients.length : 0,
            vehicleTypeBreakdown
          },
          popularVehicleTypes: (metrics.popularVehicleTypes || []).sort((a, b) => b.count - a.count),
          dailyStats: (metrics.dailyStats || []).slice(-7), // Last 7 days
          hourlyDistribution: hourlyStats,
          performance: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            nodeVersion: process.version,
            platform: process.platform
          }
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get metrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

function getPeriodInMs(period) {
  const periods = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '1y': 365 * 24 * 60 * 60 * 1000
  };
  return periods[period] || periods['7d'];
}

module.exports = metricsController;
