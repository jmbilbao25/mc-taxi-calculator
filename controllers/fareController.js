const FareCalculation = require('../models/FareCalculation');
const AppMetrics = require('../models/AppMetrics');

const fareController = {
  // Calculate fare based on distance using Philippine taxi fare structure
  calculateFare: async (req, res) => {
    try {
      const {
        distance,
        vehicleType = 'motorcycle',
        clientId = 'anonymous'
      } = req.body;

      // Calculate fare using Philippine taxi fare structure
      const fareResult = calculatePhilippineTaxiFare(distance);
      const totalFare = fareResult.fare;

      // Create new fare calculation record
      const calculation = new FareCalculation({
        distance,
        baseFare: fareResult.baseFare,
        perKmRate: fareResult.averageRate,
        totalFare,
        vehicleType,
        clientId,
        fareBreakdown: fareResult.breakdown,
        tierDetails: fareResult.tierDetails,
        metadata: {
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip,
          location: req.body.location
        }
      });

      await calculation.save();

      // Update metrics
      await updateMetrics(vehicleType, totalFare);

      res.status(200).json({
        success: true,
        data: {
          calculationId: calculation._id,
          distance,
          totalFare,
          vehicleType,
          breakdown: fareResult.breakdown,
          fareBreakdown: fareResult.detailedBreakdown,
          tierDetails: fareResult.tierDetails,
          timestamp: calculation.timestamp
        }
      });
    } catch (error) {
      console.error('Calculate fare error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get fare calculation history
  getFareHistory: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        clientId,
        vehicleType,
        startDate,
        endDate,
        sortBy = 'timestamp',
        sortOrder = 'desc'
      } = req.query;

      // Build query filter
      const filter = {};
      if (clientId) filter.clientId = clientId;
      if (vehicleType) filter.vehicleType = vehicleType;
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }

      // Execute query with pagination
      const calculations = await FareCalculation
        .find(filter)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-metadata -__v');

      const total = await FareCalculation.countDocuments(filter);

      // Calculate summary statistics
      const stats = await FareCalculation.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalCalculations: { $sum: 1 },
            averageFare: { $avg: '$totalFare' },
            totalDistance: { $sum: '$distance' },
            minFare: { $min: '$totalFare' },
            maxFare: { $max: '$totalFare' }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          calculations,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
          },
          summary: stats.length > 0 ? {
            totalCalculations: stats[0].totalCalculations,
            averageFare: parseFloat(stats[0].averageFare.toFixed(2)),
            totalDistance: parseFloat(stats[0].totalDistance.toFixed(2)),
            fareRange: {
              min: stats[0].minFare,
              max: stats[0].maxFare
            }
          } : null
        }
      });
    } catch (error) {
      console.error('Get fare history error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

// Helper function to update metrics
async function updateMetrics(vehicleType, totalFare) {
  try {
    let metrics = await AppMetrics.findOne();
    
          if (!metrics) {
        metrics = new AppMetrics({
          popularVehicleTypes: [
            { type: 'motorcycle', count: 0 },
            { type: 'car', count: 0 }
          ]
        });
      }

    metrics.totalCalculations += 1;
    metrics.totalRequests += 1;
    
    // Update average fare
    const totalFareSum = metrics.averageFare * (metrics.totalCalculations - 1) + totalFare;
    metrics.averageFare = totalFareSum / metrics.totalCalculations;

    // Update vehicle type popularity
    const vehicleTypeIndex = metrics.popularVehicleTypes.findIndex(v => v.type === vehicleType);
    if (vehicleTypeIndex !== -1) {
      metrics.popularVehicleTypes[vehicleTypeIndex].count += 1;
    }

    // Update daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyStatIndex = metrics.dailyStats.findIndex(
      stat => stat.date.getTime() === today.getTime()
    );

    if (dailyStatIndex !== -1) {
      metrics.dailyStats[dailyStatIndex].calculations += 1;
      metrics.dailyStats[dailyStatIndex].totalRevenue += totalFare;
    } else {
      metrics.dailyStats.push({
        date: today,
        requests: 1,
        calculations: 1,
        totalRevenue: totalFare
      });
    }

    metrics.lastUpdated = new Date();
    await metrics.save();
  } catch (error) {
    console.error('Update metrics error:', error);
  }
}

// Philippine Taxi Fare Calculation Function
function calculatePhilippineTaxiFare(distanceKm) {
  let totalFare = 0;
  let breakdownText = '';
  let detailedBreakdown = [];
  let tierDetails = {};

  if (distanceKm < 1) {
    // Less than 1km - minimum fare
    totalFare = 50;
    breakdownText = `Minimum fare (under 1km): ₱50.00`;
    detailedBreakdown.push({
      description: 'Minimum fare (under 1km)',
      amount: 50
    });
    tierDetails.tier1 = {
      range: '0-1km',
      rate: 50,
      amount: 50
    };
  } else if (distanceKm >= 1 && distanceKm <= 2) {
    // 1km to 2km: 50 pesos (base fare)
    totalFare = 50;
    breakdownText = `Base fare (1-2km): ₱50.00`;
    detailedBreakdown.push({
      description: 'Base fare (1-2km)',
      amount: 50
    });
    tierDetails.tier1 = {
      range: '1-2km',
      rate: 50,
      amount: 50
    };
  } else if (distanceKm >= 3 && distanceKm <= 8) {
    // 3km to 8km: 50 pesos base + (distance - 2) × 10 pesos
    const additionalKm = distanceKm - 2;
    const additionalFare = additionalKm * 10;
    totalFare = 50 + additionalFare;
    breakdownText = `Base fare: ₱50.00\nAdditional ${additionalKm.toFixed(2)}km × ₱10.00 = ₱${additionalFare.toFixed(2)}`;
    
    detailedBreakdown.push({
      description: 'Base fare (1-2km)',
      amount: 50
    });
    detailedBreakdown.push({
      description: `Additional distance (${additionalKm.toFixed(2)}km × ₱10.00)`,
      amount: parseFloat(additionalFare.toFixed(2))
    });

    tierDetails.tier1 = {
      range: '1-2km',
      rate: 50,
      amount: 50
    };
    tierDetails.tier2 = {
      range: '3-8km',
      rate: 10,
      amount: parseFloat(additionalFare.toFixed(2))
    };
  } else if (distanceKm >= 9) {
    // 9km and above: 50 pesos base + (6 × 10 pesos) + (distance - 8) × 12 pesos
    const tier1Km = 6; // 3-8km range (6km total)
    const tier1Fare = tier1Km * 10;
    const tier2Km = distanceKm - 8;
    const tier2Fare = tier2Km * 12;
    totalFare = 50 + tier1Fare + tier2Fare;
    breakdownText = `Base fare: ₱50.00\n3-8km (${tier1Km}km) × ₱10.00 = ₱${tier1Fare.toFixed(2)}\n9km+ (${tier2Km.toFixed(2)}km) × ₱12.00 = ₱${tier2Fare.toFixed(2)}`;
    
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

    tierDetails.tier1 = {
      range: '1-2km',
      rate: 50,
      amount: 50
    };
    tierDetails.tier2 = {
      range: '3-8km',
      rate: 10,
      amount: parseFloat(tier1Fare.toFixed(2))
    };
    tierDetails.tier3 = {
      range: '9km+',
      rate: 12,
      amount: parseFloat(tier2Fare.toFixed(2))
    };
  }

  // Calculate average rate for database storage
  const averageRate = distanceKm > 0 ? (totalFare - 50) / Math.max(distanceKm - 2, 0) : 0;

  return {
    fare: parseFloat(totalFare.toFixed(2)),
    breakdown: breakdownText,
    detailedBreakdown,
    tierDetails,
    baseFare: 50,
    averageRate: parseFloat(averageRate.toFixed(2)) || 0
  };
}

module.exports = fareController;
