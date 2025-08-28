import { motion } from 'framer-motion';
import { DollarSign, Info, ChevronDown, CheckCircle, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface FareResultProps {
  fare: number;
  distance: string;
  vehicleType: string;
  breakdown?: string;
}

export default function FareResult({ fare, distance, vehicleType, breakdown }: FareResultProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative overflow-hidden rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 p-6"
    >
      {/* Success indicator */}
      <div className="absolute top-4 right-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
      </div>

      {/* Main result */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-2"
        >
          <DollarSign className="h-4 w-4" />
          <span>Total Fare</span>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-5xl font-black font-display text-emerald-600 dark:text-emerald-400 mb-3 tracking-tight"
        >
          ₱{fare.toFixed(2)}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 text-emerald-600/80 dark:text-emerald-400/80 text-sm font-medium"
        >
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{distance}km</span>
          </div>
          <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
          <span className="capitalize">{vehicleType}</span>
        </motion.div>
      </div>

      {/* Breakdown section */}
      {breakdown && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-emerald-200 dark:border-emerald-800 pt-4"
        >
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
              <Info className="h-4 w-4" />
              <span>View Breakdown</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-200",
              showBreakdown && "rotate-180"
            )} />
          </button>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: showBreakdown ? "auto" : 0, 
              opacity: showBreakdown ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {showBreakdown && (
              <div className="mt-3 p-4 bg-white/60 dark:bg-gray-900/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50">
                <pre className="text-xs text-emerald-700 dark:text-emerald-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {breakdown}
                </pre>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Background decoration */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-xl" />
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-green-400/20 to-emerald-400/20 rounded-full blur-xl" />
    </motion.div>
  );
}
