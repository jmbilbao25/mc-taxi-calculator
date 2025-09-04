# 🚗 Fare Configuration System

## Overview
The MC Taxi Calculator now features a **database-driven fare configuration system** that allows administrators to dynamically update pricing, distance ranges, and vehicle types through a web interface.

## ✨ Features

### 🔧 **Dynamic Fare Management**
- **Real-time updates** to fare calculations
- **Distance-based pricing** with configurable ranges
- **Vehicle-specific rates** for different transport types
- **Base price + per-kilometer** pricing model

### 🎛️ **Admin Panel**
- **Web-based interface** at `/admin`
- **CRUD operations** for fare configurations
- **Bulk editing** capabilities
- **Real-time validation** and error handling

### 🗄️ **Database Schema**
- **PostgreSQL** backend with optimized queries
- **Normalized structure** for easy maintenance
- **Audit trails** with timestamps
- **Soft delete** functionality

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Set Up Database**
```bash
# Run the database setup script
node setup-database.js
```

### 3. **Start the Application**
```bash
# Terminal 1: Start the API server
npm run server

# Terminal 2: Start the frontend
npm run dev
```

### 4. **Access Admin Panel**
Navigate to `http://localhost:3000/admin` to manage fare configurations.

## 🗄️ Database Structure

### **Tables**

#### `vehicle_types`
- **id**: Primary key
- **name**: Unique identifier (e.g., 'motorcycle', 'car')
- **display_name**: Human-readable name (e.g., 'Motorcycle', 'Car')
- **icon**: Icon identifier for UI
- **is_active**: Whether the vehicle type is available

#### `fare_config`
- **id**: Primary key
- **vehicle_type**: References vehicle_types.name
- **min_distance**: Start of distance range (km)
- **max_distance**: End of distance range (km)
- **base_price**: Fixed starting price (₱)
- **price_per_km**: Rate per additional kilometer (₱)
- **is_active**: Whether this configuration is active
- **created_at**: Creation timestamp
- **updated_at**: Last modification timestamp

### **Sample Data**
```
Motorcycle: 0-1km = ₱50 (base only)
Motorcycle: 1-5km = ₱50 + ₱15/km
Car: 0-1km = ₱100 (base only)
Car: 1-5km = ₱100 + ₱25/km
```

## 🔌 API Endpoints

### **Fare Configuration Management**
- `GET /api/fare-config/configs` - Get all configurations
- `GET /api/fare-config/configs/:vehicleType` - Get by vehicle type
- `POST /api/fare-config/configs` - Create new configuration
- `PUT /api/fare-config/configs/:id` - Update configuration
- `DELETE /api/fare-config/configs/:id` - Soft delete configuration

### **Fare Calculation**
- `POST /api/fare-config/calculate` - Calculate fare using database configs

### **Vehicle Types**
- `GET /api/fare-config/vehicles` - Get all vehicle types

## 🎨 Frontend Components

### **FareConfigPanel**
The main admin interface component that provides:
- **Configuration grid** organized by vehicle type
- **Inline editing** for quick updates
- **Add/Delete** functionality
- **Real-time validation** and feedback

### **Integration with Calculator**
The main calculator now uses the database-driven system:
- **Dynamic pricing** based on current configurations
- **Real-time updates** when admin changes prices
- **Consistent calculation** across all vehicle types

## 🔧 Configuration Examples

### **Update Motorcycle Pricing**
```javascript
// Example: Increase motorcycle base price for short distances
PUT /api/fare-config/configs/1
{
  "base_price": 60.00,
  "price_per_km": 18.00
}
```

### **Add New Distance Range**
```javascript
// Example: Add premium pricing for long distances
POST /api/fare-config/configs
{
  "vehicle_type": "car",
  "min_distance": 100,
  "max_distance": 500,
  "base_price": 200.00,
  "price_per_km": 8.00
}
```

## 🚨 Error Handling

### **Validation Rules**
- **Distance ranges** must not overlap for same vehicle type
- **Prices** must be positive numbers
- **Vehicle types** must exist before creating configs
- **Unique constraints** prevent duplicate configurations

### **Common Issues**
- **Overlapping ranges**: Ensure distance ranges don't conflict
- **Missing vehicle types**: Create vehicle type before fare config
- **Database connection**: Check RDS connectivity and credentials

## 🔒 Security Features

### **Access Control**
- **Admin-only access** to configuration panel
- **Input validation** on both frontend and backend
- **SQL injection protection** with parameterized queries
- **Rate limiting** on API endpoints

### **Data Integrity**
- **Transaction support** for complex operations
- **Constraint validation** at database level
- **Audit logging** for all changes
- **Soft delete** to preserve data history

## 📊 Monitoring & Analytics

### **Metrics Available**
- **Configuration changes** frequency
- **Calculation success rates** by vehicle type
- **API response times** for fare calculations
- **Database query performance**

### **Logging**
- **Admin actions** are logged with timestamps
- **Error tracking** for failed operations
- **Performance metrics** for optimization

## 🚀 Deployment

### **Environment Variables**
```bash
DB_USER=postgres
DB_HOST=your-rds-endpoint
DB_NAME=mc_taxi_calculator
DB_PASSWORD=your-password
DB_PORT=5432
DB_SSL=false
```

### **Database Migration**
```bash
# Run setup script on production
NODE_ENV=production node setup-database.js
```

## 🔮 Future Enhancements

### **Planned Features**
- **Bulk import/export** of configurations
- **Pricing history** and change tracking
- **A/B testing** for different pricing models
- **Geographic pricing** variations
- **Seasonal pricing** adjustments
- **User role management** for different admin levels

### **Integration Possibilities**
- **Payment gateway** integration
- **Analytics dashboard** for business insights
- **Mobile app** for drivers
- **Customer management** system
- **Booking system** integration

## 📚 Additional Resources

- **API Documentation**: Check server.js for endpoint details
- **Database Schema**: See `config/database-schema.sql`
- **Component Library**: Review `app/components/` for UI components
- **Testing**: Use Postman collection for API testing

---

**🎯 The fare configuration system transforms your taxi calculator from a static application to a dynamic, business-ready platform that can adapt to changing market conditions and business requirements.**
