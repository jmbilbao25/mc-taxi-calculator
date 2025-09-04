// RDS-based Fare Calculation Model
const { query } = require('../config/database-rds');

class FareCalculationRDS {
  constructor(data) {
    this.distance = data.distance;
    this.vehicleType = data.vehicleType;
    this.totalFare = data.totalFare;
    this.breakdown = data.breakdown;
    this.clientId = data.clientId;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
  }

  // Save fare calculation to RDS
  async save() {
    try {
      const dbType = process.env.DB_TYPE || 'postgresql';
      
      if (dbType === 'postgresql') {
        const sql = `
          INSERT INTO fare_calculations 
          (distance, vehicle_type, total_fare, breakdown, client_id, ip_address, user_agent)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, created_at
        `;
        
        const result = await query(sql, [
          this.distance,
          this.vehicleType,
          this.totalFare,
          this.breakdown,
          this.clientId,
          this.ipAddress,
          this.userAgent
        ]);
        
        return {
          id: result.rows[0].id,
          createdAt: result.rows[0].created_at,
          ...this
        };
      } else if (dbType === 'mysql') {
        const sql = `
          INSERT INTO fare_calculations 
          (distance, vehicle_type, total_fare, breakdown, client_id, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await query(sql, [
          this.distance,
          this.vehicleType,
          this.totalFare,
          this.breakdown,
          this.clientId,
          this.ipAddress,
          this.userAgent
        ]);
        
        return {
          id: result.insertId,
          ...this
        };
      }
    } catch (error) {
      console.error('Error saving fare calculation:', error);
      throw error;
    }
  }

  // Get all fare calculations
  static async findAll(limit = 100, offset = 0) {
    try {
      const dbType = process.env.DB_TYPE || 'postgresql';
      
      if (dbType === 'postgresql') {
        const sql = `
          SELECT * FROM fare_calculations 
          ORDER BY created_at DESC 
          LIMIT $1 OFFSET $2
        `;
        const result = await query(sql, [limit, offset]);
        return result.rows;
      } else if (dbType === 'mysql') {
        const sql = `
          SELECT * FROM fare_calculations 
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `;
        const result = await query(sql, [limit, offset]);
        return result.rows;
      }
    } catch (error) {
      console.error('Error finding fare calculations:', error);
      throw error;
    }
  }

  // Get fare calculations by vehicle type
  static async findByVehicleType(vehicleType, limit = 50) {
    try {
      const dbType = process.env.DB_TYPE || 'postgresql';
      
      if (dbType === 'postgresql') {
        const sql = `
          SELECT * FROM fare_calculations 
          WHERE vehicle_type = $1 
          ORDER BY created_at DESC 
          LIMIT $2
        `;
        const result = await query(sql, [vehicleType, limit]);
        return result.rows;
      } else if (dbType === 'mysql') {
        const sql = `
          SELECT * FROM fare_calculations 
          WHERE vehicle_type = ? 
          ORDER BY created_at DESC 
          LIMIT ?
        `;
        const result = await query(sql, [vehicleType, limit]);
        return result.rows;
      }
    } catch (error) {
      console.error('Error finding fare calculations by vehicle type:', error);
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

  // Delete old records (cleanup)
  static async deleteOldRecords(daysOld = 30) {
    try {
      const dbType = process.env.DB_TYPE || 'postgresql';
      
      if (dbType === 'postgresql') {
        const sql = `
          DELETE FROM fare_calculations 
          WHERE created_at < NOW() - INTERVAL '${daysOld} days'
        `;
        const result = await query(sql);
        return result.rowCount;
      } else if (dbType === 'mysql') {
        const sql = `
          DELETE FROM fare_calculations 
          WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
        `;
        const result = await query(sql, [daysOld]);
        return result.affectedRows;
      }
    } catch (error) {
      console.error('Error deleting old records:', error);
      throw error;
    }
  }
}

module.exports = FareCalculationRDS;
