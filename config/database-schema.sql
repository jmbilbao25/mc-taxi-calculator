-- Fare Configuration Database Schema
-- Run this in your PostgreSQL database

-- Create fare configuration table
CREATE TABLE IF NOT EXISTS fare_config (
    id SERIAL PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL,
    min_distance DECIMAL(8,2) NOT NULL,
    max_distance DECIMAL(8,2) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    price_per_km DECIMAL(8,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vehicle_type, min_distance, max_distance)
);

-- Create vehicle types table
CREATE TABLE IF NOT EXISTS vehicle_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default vehicle types
INSERT INTO vehicle_types (name, display_name, icon) VALUES
('motorcycle', 'Motorcycle', 'zap'),
('tricycle', 'Tricycle', 'bike'),
('car', 'Car', 'car'),
('van', 'Van', 'truck')
ON CONFLICT (name) DO NOTHING;

-- Insert default fare configurations
INSERT INTO fare_config (vehicle_type, min_distance, max_distance, base_price, price_per_km) VALUES
-- Motorcycle
('motorcycle', 0, 1, 50.00, 0.00),
('motorcycle', 1, 5, 50.00, 15.00),
('motorcycle', 5, 10, 50.00, 12.00),
('motorcycle', 10, 20, 50.00, 10.00),
('motorcycle', 20, 50, 50.00, 8.00),
('motorcycle', 50, 100, 50.00, 6.00),
('motorcycle', 100, 1000, 50.00, 5.00),

-- Tricycle
('tricycle', 0, 1, 60.00, 0.00),
('tricycle', 1, 5, 60.00, 18.00),
('tricycle', 5, 10, 60.00, 15.00),
('tricycle', 10, 20, 60.00, 12.00),
('tricycle', 20, 50, 60.00, 10.00),
('tricycle', 50, 100, 60.00, 8.00),
('tricycle', 100, 1000, 60.00, 6.00),

-- Car
('car', 0, 1, 100.00, 0.00),
('car', 1, 5, 100.00, 25.00),
('car', 5, 10, 100.00, 20.00),
('car', 10, 20, 100.00, 18.00),
('car', 20, 50, 100.00, 15.00),
('car', 50, 100, 100.00, 12.00),
('car', 100, 1000, 100.00, 10.00),

-- Van
('van', 0, 1, 150.00, 0.00),
('van', 1, 5, 150.00, 35.00),
('van', 5, 10, 150.00, 30.00),
('van', 10, 20, 150.00, 25.00),
('van', 20, 50, 150.00, 22.00),
('van', 50, 100, 150.00, 18.00),
('van', 100, 1000, 150.00, 15.00)
ON CONFLICT (vehicle_type, min_distance, max_distance) DO NOTHING;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_fare_config_updated_at 
    BEFORE UPDATE ON fare_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fare_config_vehicle_type ON fare_config(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_fare_config_distance ON fare_config(min_distance, max_distance);
CREATE INDEX IF NOT EXISTS idx_fare_config_active ON fare_config(is_active);
