import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';

interface DistanceInputProps {
  distance: string;
  onDistanceChange: (distance: string) => void;
  disabled?: boolean;
}

export default function DistanceInput({ distance, onDistanceChange, disabled = false }: DistanceInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <label className="text-sm font-semibold text-foreground flex items-center gap-2 font-display">
        <Navigation className="h-4 w-4 text-primary" />
        <span>Distance (km)</span>
        <div className="h-1 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-full" />
      </label>
      
      <div className="relative group">
        {/* Input field */}
        <input
          type="number"
          min="1"
          max="1000"
          step="0.1"
          value={distance}
          onChange={(e) => onDistanceChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter distance in kilometers"
          className={cn(
            "w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium",
            "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary",
            "placeholder:text-muted-foreground/60",
            disabled 
              ? "bg-muted border-border cursor-not-allowed opacity-60" 
              : "bg-background border-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
          )}
        />
        
        {/* Icon */}
        <div className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
          disabled ? "text-muted-foreground" : "text-primary group-hover:text-primary/80"
        )}>
          <MapPin className="h-5 w-5" />
        </div>
        
        {/* Focus indicator */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-blue-600/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      </div>
      
      {/* Helper text */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Minimum: 1km</span>
        <span>Maximum: 1000km</span>
      </div>
    </motion.div>
  );
}
