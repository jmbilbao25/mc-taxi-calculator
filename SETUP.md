# Database Setup Guide

This guide will help you set up the database with sample data for the MC Taxi Calculator.

## Prerequisites

1. **Database Connection**: Make sure your database is running and accessible
2. **Environment Variables**: Ensure your `.env` file has the correct database credentials
3. **Node.js**: Make sure Node.js is installed

## Setup Steps

### 1. Database Schema Setup

First, create the database tables and structure:

```bash
node setup-database.js
```

This will:
- Create all necessary tables (`fare_config`, `vehicle_types`, `fare_calculations`, `app_metrics`)
- Set up indexes and triggers
- Create default constraints

### 2. Sample Data Setup

Add sample vehicle types and fare configurations:

```bash
node setup-sample-data.js
```

This will add:
- **5 Vehicle Types**: Motorcycle, Tricycle, Car, Van, Jeepney
- **35 Fare Configurations**: Complete pricing structure for all vehicle types
- **Distance-based Pricing**: Different rates for various distance ranges

## Sample Data Overview

### Vehicle Types
- 🏍️ **Motorcycle** - Icon: zap
- 🚲 **Tricycle** - Icon: bike  
- 🚗 **Car** - Icon: car
- 🚐 **Van** - Icon: truck
- 🚌 **Jeepney** - Icon: truck

### Fare Structure Examples

#### Motorcycle
- 0-1km: ₱50.00 (base fare)
- 1-5km: ₱50.00 + ₱15.00/km
- 5-10km: ₱50.00 + ₱12.00/km
- 10-20km: ₱50.00 + ₱10.00/km
- 20-50km: ₱50.00 + ₱8.00/km
- 50-100km: ₱50.00 + ₱6.00/km
- 100km+: ₱50.00 + ₱5.00/km

#### Car
- 0-1km: ₱100.00 (base fare)
- 1-5km: ₱100.00 + ₱25.00/km
- 5-10km: ₱100.00 + ₱20.00/km
- 10-20km: ₱100.00 + ₱18.00/km
- 20-50km: ₱100.00 + ₱15.00/km
- 50-100km: ₱100.00 + ₱12.00/km
- 100km+: ₱100.00 + ₱10.00/km

#### Jeepney (Public Transport)
- 0-1km: ₱12.00 (base fare)
- 1-5km: ₱12.00 + ₱2.50/km
- 5-10km: ₱12.00 + ₱2.00/km
- 10-20km: ₱12.00 + ₱1.50/km
- 20-50km: ₱12.00 + ₱1.00/km
- 50-100km: ₱12.00 + ₱0.80/km
- 100km+: ₱12.00 + ₱0.50/km

## Verification

After running both scripts, you can verify the setup by:

1. **Starting the application**:
   ```bash
   docker-compose -f docker-compose.simple-images.yml up
   ```

2. **Accessing the admin panel**: http://localhost:3000/admin

3. **Testing the API**: Use the Postman collection or test endpoints directly

## Troubleshooting

### Database Connection Issues
- Check your `.env` file has correct database credentials
- Ensure the database server is running
- Verify network connectivity

### Permission Issues
- Make sure the database user has CREATE and INSERT permissions
- Check if tables already exist (scripts will handle conflicts gracefully)

### Data Not Appearing
- Check the admin panel for vehicle types
- Verify the API endpoints are working
- Check browser console for any errors

## Customization

You can modify the sample data by editing `setup-sample-data.js`:
- Add new vehicle types
- Modify fare structures
- Adjust pricing tiers
- Add new distance ranges

## Reset Data

To reset and reload sample data:
```bash
node setup-sample-data.js
```
The script will clear existing data and reload fresh sample data.
