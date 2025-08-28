import { motion } from 'framer-motion';
import { RotateCcw, RefreshCw } from 'lucide-react';

interface ResetButtonProps {
  onClick: () => void;
  show: boolean;
}

export default function ResetButton({ onClick, show }: ResetButtonProps) {
  if (!show) return null;
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-accent/50 rounded-2xl border border-border/50 hover:border-border group"
    >
      <motion.div
        whileHover={{ rotate: -180 }}
        transition={{ duration: 0.3 }}
      >
        <RotateCcw className="h-4 w-4" />
      </motion.div>
      <span className="text-sm font-medium">Reset Calculator</span>
    </motion.button>
  );
}
