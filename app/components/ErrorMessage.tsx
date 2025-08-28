import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-2xl border border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 p-4"
    >
      {/* Background decoration */}
      <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full blur-xl" />
      
      <div className="relative flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900/50 rounded-xl"
        >
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-red-700 dark:text-red-300 leading-relaxed"
          >
            {message}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
