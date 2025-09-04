import { motion } from 'framer-motion';
import { Car, Bike, Truck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

interface VehicleType {
  id: number;
  name: string;
  display_name: string;
  icon: string;
}

interface VehicleSelectorProps {
  selectedVehicle: string;
  onVehicleChange: (vehicle: string) => void;
}

const getVehicleIcon = (iconName: string) => {
  switch (iconName) {
    case 'car': return Car;
    case 'bike': return Bike;
    case 'truck': return Truck;
    case 'zap': return Zap;
    default: return Car;
  }
};

const getVehicleEmoji = (iconName: string) => {
  switch (iconName) {
    case 'car': return '🚗';
    case 'bike': return '🏍️';
    case 'truck': return '🚛';
    case 'zap': return '⚡';
    default: return '🚗';
  }
};

export default function VehicleSelector({ selectedVehicle, onVehicleChange }: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/fare-config/vehicles`);
      const data = await response.json();
      if (data.success) {
        setVehicles(data.data);
        // Set default vehicle if none selected
        if (!selectedVehicle && data.data.length > 0) {
          onVehicleChange(data.data[0].name);
        }
      } else {
        setError('Failed to load vehicle types');
      }
    } catch (error) {
      setError('Failed to load vehicle types');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleClick = (vehicleId: string) => {
    if (vehicleId && vehicleId.length > 0) {
      onVehicleChange(vehicleId);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2 font-display">
          <span>Choose Vehicle</span>
          <div className="h-1 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-full" />
        </label>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2 font-display">
          <span>Choose Vehicle</span>
          <div className="h-1 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-full" />
        </label>
        <div className="text-center p-4 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2 font-display">
        <span>Choose Vehicle</span>
        <div className="h-1 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-full" />
      </label>
      <div className="grid grid-cols-2 gap-4">
        {vehicles.map((vehicle, index) => {
          const Icon = getVehicleIcon(vehicle.icon);
          const emoji = getVehicleEmoji(vehicle.icon);
          const isSelected = selectedVehicle === vehicle.name;
          
          return (
            <motion.button
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVehicleClick(vehicle.name)}
              className={cn(
                "relative p-6 rounded-2xl border-2 text-center transition-all duration-300 group overflow-hidden",
                isSelected 
                  ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              )}
            >
              {/* Background gradient effect */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                isSelected 
                  ? "from-primary/10 to-blue-600/10 opacity-100"
                  : "from-primary/5 to-blue-600/5 group-hover:opacity-100"
              )} />
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selection"
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <div className={cn(
                    "p-3 rounded-2xl transition-all duration-300",
                    isSelected 
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {emoji}
                </div>
                
                <div className={cn(
                  "font-bold text-lg mb-1 font-display",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {vehicle.display_name}
                </div>
                
                <div className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-primary/80" : "text-muted-foreground"
                )}>
                  {vehicle.name}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
