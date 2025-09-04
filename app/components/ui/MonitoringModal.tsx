'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Activity, Database, Globe, ExternalLink, Shield } from 'lucide-react';
import { useEffect } from 'react';

interface MonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getMonitoringLinks = () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'http://35.74.250.160:3001'
    : 'http://localhost';
    
  return [
    {
      name: 'Grafana Dashboard',
      description: 'Application metrics and monitoring',
      url: `${baseUrl}:3000/`,
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      status: 'active'
    },
    {
      name: 'Prometheus Query',
      description: 'Raw metrics and time series data',
      url: `${baseUrl}:9090/query`,
      icon: Activity,
      color: 'from-blue-500 to-indigo-500',
      status: 'active'
    },
    {
      name: 'API Health',
      description: 'Backend health status',
      url: `${baseUrl.replace(':3000', '')}:3001/api/health`,
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      status: 'active'
    },
    {
      name: 'Metrics Endpoint',
      description: 'Application metrics endpoint',
      url: `${baseUrl.replace(':3000', '')}:3001/metrics`,
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      status: 'active'
    }
  ];
};

export function MonitoringModal({ isOpen, onClose }: MonitoringModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-3xl shadow-2xl border border-border max-w-2xl w-full mx-4 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-foreground">Admin Panel</h2>
                    <p className="text-sm text-muted-foreground">Monitoring & Analytics</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getMonitoringLinks().map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.button
                        key={link.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleLinkClick(link.url)}
                        className="group relative p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 text-left overflow-hidden hover:shadow-lg hover:shadow-primary/10"
                      >
                        {/* Background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${link.color} shadow-lg`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">{link.status}</span>
                            </div>
                          </div>
                          
                          <h3 className="font-bold font-display text-foreground mb-2 group-hover:text-primary transition-colors">
                            {link.name}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {link.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                              {link.url.replace('http://localhost:', ':')}
                            </span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Status & Warning */}
                <div className="space-y-3 mt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-blue-500 mt-0.5">ℹ️</div>
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm">
                          Service Status
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Services are running on AWS EC2 (35.74.250.160). If Grafana shows loading issues, the service may need restart.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-amber-500 mt-0.5">⚠️</div>
                      <div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                          Admin Access Only
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          These monitoring tools are for authorized personnel only. Access is provided to production monitoring services.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
