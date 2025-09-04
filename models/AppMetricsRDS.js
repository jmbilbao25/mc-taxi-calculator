// RDS-based App Metrics Model
const { query } = require('../config/database-rds');

class AppMetricsRDS {
  constructor(data = {}) {
    this.totalRequests = data.totalRequests || 0;
    this.totalCalculations = data.totalCalculations || 0;
    this.averageFare = data.averageFare || 0;
    this.popularVehicleTypes = data.popularVehicleTypes || [
      { type: 'motorcycle', count: 0 },
      { type: 'car', count: 0 }
    ];
    this.dailyStats = data.dailyStats || [];
    this.lastUpdated = data.lastUpdated || new Date();
  }

  // Save or update metrics
  async save() {
    try {
      const dbType = process.env.DB_TYPE || 'postgresql';
      
      if (dbType === 'postgresql') {
        // Check if metrics record exists
        const checkSql = 'SELECT id FROM app_metrics LIMIT 1';
        const existing = await query(checkSql);
        
        if (existing.rows.length > 0) {
          // Update existing record
          const updateSql = `
            UPDATE app_metrics SET
              total_requests = $1,
              total_calculations = $2,
              average_fare = $3,
              popular_vehicle_types = $4,
              daily_stats = $5,
              last_updated = $6
            WHERE id = $7
          `;
          
          const result = await query(updateSql, [
            this.totalRequests,
            this.totalCalculations,
            this.averageFare,
            JSON.stringify(this.popularVehicleTypes),
            JSON.stringify(this.dailyStats),
            this.lastUpdated,
            existing.rows[0].id
          ]);
          
          return { id: existing.rows[0].id, ...this };
        } else {
          // Insert new record
          const insertSql = `
            INSERT INTO app_metrics 
            (total_requests, total_calculations, average_fare, popular_vehicle_types, daily_stats, last_updated)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
          `;
          
          const result = await query(insertSql, [
            this.totalRequests,
            this.totalCalculations,
            this.averageFare,
            JSON.stringify(this.popularVehicleTypes),
            JSON.stringify(this.dailyStats),
            this.lastUpdated
          ]);
          
          return { id: result.rows[0].id, ...this };
        }
      } else if (dbType === 'mysql') {
        // Check if metrics record exists
        const checkSql = 'SELECT id FROM app_metrics LIMIT 1';
        const existing = await query(checkSql);
        
        if (existing.rows.length > 0) {
          // Update existing record
          const updateSql = `
            UPDATE app_metrics SET
              total_requests = ?,
              total_calculations = ?,
              average_fare = ?,
              popular_vehicle_types = ?,
              daily_stats = ?,
              last_updated = ?
            WHERE id = ?
          `;
          
          const result = await query(updateSql, [
            this.totalRequests,
            this.totalCalculations,
            this.averageFare,
            JSON.stringify(this.popularVehicleTypes),
            JSON.stringify(this.dailyStats),
            this.lastUpdated,
            existing.rows[0].id
          ]);
          
          return { id: existing.rows[0].id, ...this };
        } else {
          // Insert new record
          const insertSql = `
            INSERT INTO app_metrics 
            (total_requests, total_calculations, average_fare, popular_vehicle_types, daily_stats, last_updated)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          
          const result = await query(insertSql, [
            this.totalRequests,
            this.totalCalculations,
            this.averageFare,
            JSON.stringify(this.popularVehicleTypes),
            JSON.stringify(this.dailyStats),
            this.lastUpdated
          ]);
          
          return { id: result.insertId, ...this };
        }
      }
    } catch (error) {
      console.error('Error saving app metrics:', error);
      throw error;
    }
  }

  // Find existing metrics
  static async findOne() {
    try {
      const dbType = process.env.DB_TYPE || 'postgresql';
      
      if (dbType === 'postgresql') {
        const sql = 'SELECT * FROM app_metrics LIMIT 1';
        const result = await query(sql);
        
        if (result.rows.length > 0) {
          const row = result.rows[0];
          return new AppMetricsRDS({
            totalRequests: row.total_requests,
            totalCalculations: row.total_calculations,
            averageFare: row.average_fare,
            popularVehicleTypes: JSON.parse(row.popular_vehicle_types || '[]'),
            dailyStats: JSON.parse(row.daily_stats || '[]'),
            lastUpdated: row.last_updated
          });
        }
        return null;
      } else if (dbType === 'mysql') {
        const sql = 'SELECT * FROM app_metrics LIMIT 1';
        const result = await query(sql);
        
        if (result.rows.length > 0) {
          const row = result.rows[0];
          return new AppMetricsRDS({
            totalRequests: row.total_requests,
            totalCalculations: row.total_calculations,
            averageFare: row.average_fare,
            popularVehicleTypes: JSON.parse(row.popular_vehicle_types || '[]'),
            dailyStats: JSON.parse(row.daily_stats || '[]'),
            lastUpdated: row.last_updated
          });
        }
        return null;
      }
    } catch (error) {
      console.error('Error finding app metrics:', error);
      throw error;
    }
  }

  // Get statistics
  static async getStatistics() {
    try {
      const dbType = process.env.DB_TYPE || 'postgresql';
      
      if (dbType === 'postgresql') {
        const sql = `
          SELECT 
            COUNT(*) as total_calculations,
            vehicle_type,
            AVG(total_fare) as avg_fare,
            MIN(total_fare) as min_fare,
            MAX(total_fare) as max_fare,
            AVG(distance) as avg_distance
          FROM fare_calculations 
          GROUP BY vehicle_type
        `;
        const result = await query(sql);
        return result.rows;
      } else if (dbType === 'mysql') {
        const sql = `
          SELECT 
            COUNT(*) as total_calculations,
            vehicle_type,
            AVG(total_fare) as avg_fare,
            MIN(total_fare) as min_fare,
            MAX(total_fare) as max_fare,
            AVG(distance) as avg_distance
          FROM fare_calculations 
          GROUP BY vehicle_type
        `;
        const result = await query(sql);
        return result.rows;
      }
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }
}

module.exports = AppMetricsRDS;
