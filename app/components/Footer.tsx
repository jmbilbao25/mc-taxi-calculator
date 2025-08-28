import { motion } from 'framer-motion';
import { Info, DollarSign } from 'lucide-react';

interface FooterProps {
  message: string;
}

export default function Footer({ message }: FooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-gradient-to-r from-muted/50 to-accent/50 backdrop-blur-sm text-center py-4 px-6 border-t border-border/50"
    >
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Info className="h-3 w-3" />
        <p className="text-xs font-medium">{message}</p>
        <DollarSign className="h-3 w-3" />
      </div>
      
      {/* Subtle animation effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-600/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
