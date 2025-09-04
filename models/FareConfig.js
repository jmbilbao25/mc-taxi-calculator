const { Pool } = require('pg');

class FareConfig {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com',
      database: process.env.DB_NAME || 'mc_taxi_calculator',
      password: process.env.DB_PASSWORD || 'D78SIf4QLaAATWWTMABu',
      port: process.env.DB_PORT || 5432,
      ssl: {
        rejectUnauthorized: false,
        require: true
      },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
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

  // Calculate fare based on Philippine taxi fare structure
  async calculateFare(vehicleType, distance) {
    try {
      // Philippine Taxi Fare Structure
      let totalFare = 0;
      let breakdown = '';
      let detailedBreakdown = [];
      
      if (distance >= 1 && distance <= 2) {
        // 1km to 2km: 50 pesos (base fare)
        totalFare = 50;
        breakdown = `Base fare (1-2km): ₱50.00`;
        detailedBreakdown.push({
          description: 'Base fare (1-2km)',
          amount: 50
        });
      } else if (distance >= 3 && distance <= 8) {
        // 3km to 8km: 50 pesos base + (distance - 2) × 10 pesos
        const additionalKm = distance - 2;
        const additionalFare = additionalKm * 10;
        totalFare = 50 + additionalFare;
        breakdown = `Base fare: ₱50.00 + Additional ${additionalKm.toFixed(2)}km × ₱10.00 = ₱${additionalFare.toFixed(2)}`;
        
        detailedBreakdown.push({
          description: 'Base fare (1-2km)',
          amount: 50
        });
        detailedBreakdown.push({
          description: `Additional distance (${additionalKm.toFixed(2)}km × ₱10.00)`,
          amount: parseFloat(additionalFare.toFixed(2))
        });
      } else if (distance >= 9) {
        // 9km and above: 50 pesos base + (6 × 10 pesos) + (distance - 8) × 12 pesos
        const tier1Km = 6; // 3-8km range (6km total)
        const tier1Fare = tier1Km * 10;
        const tier2Km = distance - 8;
        const tier2Fare = tier2Km * 12;
        totalFare = 50 + tier1Fare + tier2Fare;
        breakdown = `Base fare: ₱50.00 + 3-8km (${tier1Km}km) × ₱10.00 = ₱${tier1Fare.toFixed(2)} + 9km+ (${tier2Km.toFixed(2)}km) × ₱12.00 = ₱${tier2Fare.toFixed(2)}`;
        
        detailedBreakdown.push({
          description: 'Base fare (1-2km)',
          amount: 50
        });
        detailedBreakdown.push({
          description: `Mid-range (3-8km: ${tier1Km}km × ₱10.00)`,
          amount: parseFloat(tier1Fare.toFixed(2))
        });
        detailedBreakdown.push({
          description: `Long distance (9km+: ${tier2Km.toFixed(2)}km × ₱12.00)`,
          amount: parseFloat(tier2Fare.toFixed(2))
        });
      } else {
        // Less than 1km - minimum fare
        totalFare = 50;
        breakdown = `Minimum fare (under 1km): ₱50.00`;
        detailedBreakdown.push({
          description: 'Minimum fare (under 1km)',
          amount: 50
        });
      }
      
      return {
        fare: parseFloat(totalFare.toFixed(2)),
        breakdown: {
          basePrice: 50,
          pricePerKm: distance > 8 ? 12 : (distance > 2 ? 10 : 0),
          distance: distance,
          calculation: breakdown
        },
        detailedBreakdown: detailedBreakdown,
        config: {
          vehicle_type: vehicleType,
          distance: distance,
          fare_structure: 'Philippine Taxi Standard'
        }
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

  // Create new vehicle type
  async createVehicleType(vehicleData) {
    try {
      const query = `
        INSERT INTO vehicle_types (name, display_name, icon)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const values = [
        vehicleData.name,
        vehicleData.display_name,
        vehicleData.icon
      ];
      
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating vehicle type:', error);
      throw error;
    }
  }

  // Delete vehicle type (soft delete)
  async deleteVehicleType(id) {
    try {
      // First check if the vehicle type exists
      const existsQuery = `
        SELECT id, name, display_name, is_active 
        FROM vehicle_types 
        WHERE id = $1
      `;
      const existsResult = await this.pool.query(existsQuery, [id]);
      
      if (existsResult.rows.length === 0) {
        throw new Error('Vehicle type not found');
      }
      
      const vehicle = existsResult.rows[0];
      
      // Check if already deleted
      if (!vehicle.is_active) {
        throw new Error('Vehicle type is already deleted');
      }
      
      // Check if there are any fare configs using this vehicle type
      const checkQuery = `
        SELECT COUNT(*) as count 
        FROM fare_config 
        WHERE vehicle_type = $1 AND is_active = true
      `;
      const checkResult = await this.pool.query(checkQuery, [vehicle.name]);
      
      if (parseInt(checkResult.rows[0].count) > 0) {
        throw new Error('Cannot delete vehicle type. There are active fare configurations using this vehicle type.');
      }

      // Soft delete the vehicle type
      const query = `
        UPDATE vehicle_types 
        SET is_active = false
        WHERE id = $1
        RETURNING *
      `;
      const result = await this.pool.query(query, [id]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting vehicle type:', error);
      throw error;
    }
  }

  // Close database connection
  async close() {
    await this.pool.end();
  }
}

module.exports = FareConfig;
