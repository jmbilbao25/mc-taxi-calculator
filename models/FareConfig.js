const { Pool } = require('pg');

class FareConfig {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com',
      database: process.env.DB_NAME || 'mc_taxi_calculator',
      password: process.env.DB_PASSWORD || 'D78SIf4QLaAATWWTMABu',
      port: process.env.DB_PORT || 5432,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
  }

  // Get all fare configurations
  async getAllFareConfigs() {
    try {
      const query = `
        SELECT fc.*, vt.display_name as vehicle_display_name, vt.icon
        FROM fare_config fc
        JOIN vehicle_types vt ON fc.vehicle_type = vt.name
        WHERE fc.is_active = true
        ORDER BY fc.vehicle_type, fc.min_distance
      `;
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting fare configs:', error);
      throw error;
    }
  }

  // Get fare configuration by vehicle type
  async getFareConfigByVehicle(vehicleType) {
    try {
      const query = `
        SELECT * FROM fare_config 
        WHERE vehicle_type = $1 AND is_active = true
        ORDER BY min_distance
      `;
      const result = await this.pool.query(query, [vehicleType]);
      return result.rows;
    } catch (error) {
      console.error('Error getting fare config by vehicle:', error);
      throw error;
    }
  }

  // Calculate fare based on distance and vehicle type
  async calculateFare(vehicleType, distance) {
    try {
      const query = `
        SELECT * FROM fare_config 
        WHERE vehicle_type = $1 
        AND $2 >= min_distance 
        AND $2 <= max_distance 
        AND is_active = true
        LIMIT 1
      `;
      const result = await this.pool.query(query, [vehicleType, distance]);
      
      if (result.rows.length === 0) {
        throw new Error(`No fare configuration found for ${vehicleType} at distance ${distance}km`);
      }
      
      const config = result.rows[0];
      const fare = config.base_price + (distance * config.price_per_km);
      
      return {
        fare: Math.round(fare * 100) / 100, // Round to 2 decimal places
        breakdown: {
          basePrice: config.base_price,
          pricePerKm: config.price_per_km,
          distance: distance,
          calculation: `${config.base_price} + (${distance} × ${config.price_per_km})`
        },
        config: config
      };
    } catch (error) {
      console.error('Error calculating fare:', error);
      throw error;
    }
  }

  // Update fare configuration
  async updateFareConfig(id, updates) {
    try {
      const allowedFields = ['min_distance', 'max_distance', 'base_price', 'price_per_km', 'is_active'];
      const setFields = [];
      const values = [];
      let paramCount = 1;

      for (const [field, value] of Object.entries(updates)) {
        if (allowedFields.includes(field)) {
          setFields.push(`${field} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }

      if (setFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      values.push(id);
      const query = `
        UPDATE fare_config 
        SET ${setFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating fare config:', error);
      throw error;
    }
  }

  // Create new fare configuration
  async createFareConfig(config) {
    try {
      const query = `
        INSERT INTO fare_config (vehicle_type, min_distance, max_distance, base_price, price_per_km)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        config.vehicle_type,
        config.min_distance,
        config.max_distance,
        config.base_price,
        config.price_per_km
      ];
      
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating fare config:', error);
      throw error;
    }
  }

  // Delete fare configuration (soft delete)
  async deleteFareConfig(id) {
    try {
      const query = `
        UPDATE fare_config 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;
      const result = await this.pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting fare config:', error);
      throw error;
    }
  }

  // Get vehicle types
  async getVehicleTypes() {
    try {
      const query = 'SELECT * FROM vehicle_types WHERE is_active = true ORDER BY name';
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting vehicle types:', error);
      throw error;
    }
  }

  // Close database connection
  async close() {
    await this.pool.end();
  }
}

module.exports = FareConfig;
