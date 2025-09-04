const AppMetricsRDS = require('../models/AppMetricsRDS');
const FareCalculationRDS = require('../models/FareCalculationRDS');

const metricsController = {
  getMetrics: async (req, res) => {
    try {
      const { period = '7d' } = req.query;

      // Get or create metrics document
      let metrics = await AppMetricsRDS.findOne();
      if (!metrics) {
        metrics = new AppMetricsRDS();
        await metrics.save();
      }

      // Get basic statistics from RDS
      let periodStats = [];
      try {
        periodStats = await FareCalculationRDS.getStatistics();
      } catch (error) {
        console.error('Statistics error:', error);
        // Continue with empty stats if query fails
      }

      // Vehicle type breakdown
      const vehicleBreakdown = {};
      if (periodStats.length > 0) {
        periodStats.forEach(stat => {
          vehicleBreakdown[stat.vehicle_type] = parseInt(stat.total_calculations);
        });
      }

      // Simplified hourly stats (not available in basic RDS setup)
      const hourlyStats = [];

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
            calculations: periodStats.reduce((sum, stat) => sum + parseInt(stat.total_calculations), 0),
            averageFare: periodStats.length > 0 ? 
              parseFloat((periodStats.reduce((sum, stat) => sum + parseFloat(stat.avg_fare), 0) / periodStats.length).toFixed(2)) : 0,
            totalRevenue: periodStats.reduce((sum, stat) => sum + (parseFloat(stat.avg_fare) * parseInt(stat.total_calculations)), 0),
            uniqueClients: 0, // Not tracked in basic RDS setup
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
