import { motion } from 'framer-motion';
import { Car, Bike, Truck, Zap, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect, useRef } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Try multiple API endpoints in case of deployment issues
  const getApiBase = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Fallback URLs for different deployment scenarios
    const fallbackUrls = [
      'http://35.74.250.160:3001',
      'http://13.211.151.184:3001',
      'http://localhost:3001'
    ];
    
    return fallbackUrls[0]; // Use the primary URL
  };
  
  const API_BASE = getApiBase();

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchVehicles = async () => {
    const fallbackUrls = [
      'http://35.74.250.160:3001',
      'http://13.211.151.184:3001',
      'http://localhost:3001'
    ];
    
    // Try the configured API_BASE first, then fallbacks
    const urlsToTry = [API_BASE, ...fallbackUrls.filter(url => url !== API_BASE)];
    
    for (const baseUrl of urlsToTry) {
      try {
        console.log(`Trying to fetch vehicles from: ${baseUrl}`);
        const response = await fetch(`${baseUrl}/api/fare-config/vehicles`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setVehicles(data.data);
            // Set default vehicle if none selected
            if (!selectedVehicle && data.data.length > 0) {
              onVehicleChange(data.data[0].name);
            }
            setError(null);
            setLoading(false);
            return; // Success, exit the loop
          }
        }
      } catch (error) {
        console.error(`Failed to fetch from ${baseUrl}:`, error);
        continue; // Try next URL
      }
    }
    
    // If all URLs failed
    setError('Failed to load vehicle types from all endpoints');
    setLoading(false);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    if (vehicleId && vehicleId.length > 0) {
      onVehicleChange(vehicleId);
      setIsOpen(false);
    }
  };

  const selectedVehicleData = vehicles.find(v => v.name === selectedVehicle);

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
      
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-center justify-between",
            isOpen 
              ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20' 
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          )}
        >
          <div className="flex items-center gap-3">
            {selectedVehicleData ? (
              <>
                <div className="text-2xl">
                  {getVehicleEmoji(selectedVehicleData.icon)}
                </div>
                <div>
                  <div className="font-bold text-lg font-display">
                    {selectedVehicleData.display_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedVehicleData.name}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">
                Select a vehicle type...
              </div>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.button>

        {/* Dropdown Options */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg overflow-hidden z-50"
        >
          <div className="max-h-60 overflow-y-auto">
            {vehicles.map((vehicle, index) => {
              const Icon = getVehicleIcon(vehicle.icon);
              const emoji = getVehicleEmoji(vehicle.icon);
              const isSelected = selectedVehicle === vehicle.name;
              
              return (
                <motion.button
                  key={vehicle.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(var(--primary), 0.1)' }}
                  onClick={() => handleVehicleSelect(vehicle.name)}
                  className={cn(
                    "w-full p-4 text-left transition-all duration-200 flex items-center gap-3 border-b border-border last:border-b-0",
                    isSelected 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-accent/50'
                  )}
                >
                  <div className="text-2xl">
                    {emoji}
                  </div>
                  <div className="flex-1">
                    <div className={cn(
                      "font-bold text-lg font-display",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {vehicle.display_name}
                    </div>
                    <div className={cn(
                      "text-sm",
                      isSelected ? "text-primary/80" : "text-muted-foreground"
                    )}>
                      {vehicle.name}
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
