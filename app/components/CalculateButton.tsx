import { motion } from 'framer-motion';
import { Calculator, Loader2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface CalculateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function CalculateButton({ onClick, loading, disabled }: CalculateButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl py-4 px-6 text-lg font-bold font-display transition-all duration-300",
        "focus:outline-none focus:ring-4 focus:ring-primary/30",
        "group",
        disabled 
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-purple-600 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30"
      )}
    >
      {/* Background shimmer effect */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      
      <div className="relative flex items-center justify-center gap-3">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Calculating fare...</span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span>Calculate Fare</span>
            </div>
            {!disabled && (
              <Zap className="h-4 w-4 text-yellow-300 group-hover:animate-pulse" />
            )}
          </>
        )}
      </div>
      
      {/* Pulse effect when loading */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-white/10 rounded-2xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
