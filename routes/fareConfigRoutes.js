const express = require('express');
const router = express.Router();
const FareConfig = require('../models/FareConfig');

// Get all fare configurations
router.get('/configs', async (req, res) => {
  try {
    const fareConfig = new FareConfig();
    const configs = await fareConfig.getAllFareConfigs();
    await fareConfig.close();
    
    res.json({
      success: true,
      data: configs,
      message: 'Fare configurations retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting fare configs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve fare configurations',
      details: error.message
    });
  }
});

// Get fare configuration by vehicle type
router.get('/configs/:vehicleType', async (req, res) => {
  try {
    const { vehicleType } = req.params;
    const fareConfig = new FareConfig();
    const configs = await fareConfig.getFareConfigByVehicle(vehicleType);
    await fareConfig.close();
    
    res.json({
      success: true,
      data: configs,
      message: `Fare configurations for ${vehicleType} retrieved successfully`
    });
  } catch (error) {
    console.error('Error getting fare config by vehicle:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve fare configuration',
      details: error.message
    });
  }
});

// Calculate fare
router.post('/calculate', async (req, res) => {
  try {
    const { vehicleType, distance } = req.body;
    
    if (!vehicleType || !distance) {
      return res.status(400).json({
        success: false,
        error: 'Vehicle type and distance are required'
      });
    }
    
    const fareConfig = new FareConfig();
    const result = await fareConfig.calculateFare(vehicleType, parseFloat(distance));
    await fareConfig.close();
    
    res.json({
      success: true,
      data: result,
      message: 'Fare calculated successfully'
    });
  } catch (error) {
    console.error('Error calculating fare:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fare',
      details: error.message
    });
  }
});

// Update fare configuration
router.put('/configs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided'
      });
    }
    
    const fareConfig = new FareConfig();
    const updated = await fareConfig.updateFareConfig(id, updates);
    await fareConfig.close();
    
    res.json({
      success: true,
      data: updated,
      message: 'Fare configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating fare config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update fare configuration',
      details: error.message
    });
  }
});

// Create new fare configuration
router.post('/configs', async (req, res) => {
  try {
    const { vehicle_type, min_distance, max_distance, base_price, price_per_km } = req.body;
    
    if (!vehicle_type || min_distance === undefined || max_distance === undefined || 
        base_price === undefined || price_per_km === undefined) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: vehicle_type, min_distance, max_distance, base_price, price_per_km'
      });
    }
    
    const fareConfig = new FareConfig();
    const created = await fareConfig.createFareConfig({
      vehicle_type,
      min_distance: parseFloat(min_distance),
      max_distance: parseFloat(max_distance),
      base_price: parseFloat(base_price),
      price_per_km: parseFloat(price_per_km)
    });
    await fareConfig.close();
    
    res.status(201).json({
      success: true,
      data: created,
      message: 'Fare configuration created successfully'
    });
  } catch (error) {
    console.error('Error creating fare config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create fare configuration',
      details: error.message
    });
  }
});

// Delete fare configuration (soft delete)
router.delete('/configs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const fareConfig = new FareConfig();
    const deleted = await fareConfig.deleteFareConfig(id);
    await fareConfig.close();
    
    res.json({
      success: true,
      data: deleted,
      message: 'Fare configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting fare config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete fare configuration',
      details: error.message
    });
  }
});

// Get vehicle types
router.get('/vehicles', async (req, res) => {
  try {
    const fareConfig = new FareConfig();
    const vehicles = await fareConfig.getVehicleTypes();
    await fareConfig.close();
    
    res.json({
      success: true,
      data: vehicles,
      message: 'Vehicle types retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting vehicle types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve vehicle types',
      details: error.message
    });
  }
});

module.exports = router;
