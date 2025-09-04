const { query } = require('../config/database-rds');

const healthController = {
  healthCheck: async (req, res) => {
    try {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: '1.0.0',
        services: {
          database: 'unknown',
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
          },
          cpu: {
            usage: process.cpuUsage()
          }
        }
      };

      // Check database connection
      try {
        // Test database query
        const result = await query('SELECT COUNT(*) as count FROM fare_calculations');
        const count = result.rows[0]?.count || 0;
        healthData.services.database = `connected (${count} records)`;
      } catch (dbError) {
        healthData.services.database = 'disconnected';
        healthData.status = 'degraded';
      }

      const statusCode = healthData.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json({
        success: healthData.status === 'healthy',
        data: healthData
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(503).json({
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error.message
        }
      });
    }
  }
};

module.exports = healthController;
