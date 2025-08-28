'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, MapPin, Car, Bike, Moon, Sun, Sparkles } from 'lucide-react';
import { Modal } from './components/ui/Modal';
import { MonitoringModal } from './components/ui/MonitoringModal';
import Header from './components/Header';
import VehicleSelector from './components/VehicleSelector';
import DistanceInput from './components/DistanceInput';
import ErrorMessage from './components/ErrorMessage';
import CalculateButton from './components/CalculateButton';
import FareResult from './components/FareResult';
import ResetButton from './components/ResetButton';
import Footer from './components/Footer';
import { useFareCalculator } from './hooks/useFareCalculator';
import { cn } from './lib/utils';

export default function TaxiFareCalculator() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const {
    distance,
    vehicleType,
    fare,
    breakdown,
    error,
    loading,
    setDistance,
    setVehicleType,
    calculateFare: originalCalculateFare,
    reset,
    canCalculate,
    showReset
  } = useFareCalculator();

  const handleCalculateFare = () => {
    if (vehicleType === 'car') {
      setShowComingSoonModal(true);
      return;
    }
    originalCalculateFare();
  };

  const handleLogoClick = () => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    // Reset counter if more than 3 seconds between clicks
    // TODO: Maybe make this configurable
    if (timeDiff > 3000) {
      setLogoClickCount(1);
    } else {
      setLogoClickCount(prev => prev + 1);
    }
    
    setLastClickTime(currentTime);
    
    // Easter egg: Open monitoring modal after 7 quick clicks
    if (logoClickCount >= 6) {
      setShowMonitoringModal(true);
      setLogoClickCount(0);
      setLastClickTime(0);
      // Could add some haptic feedback here for mobile
    }
  };

  useEffect(() => {
    setMounted(true);
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-gentle" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-gentle" />
      </div>

      {/* Dark mode toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 rounded-full glass-effect hover:scale-110 transition-all duration-300 group"
      >
        {darkMode ? (
          <Sun className="h-5 w-5 text-yellow-500 group-hover:rotate-12 transition-transform" />
        ) : (
          <Moon className="h-5 w-5 text-blue-600 group-hover:-rotate-12 transition-transform" />
        )}
      </motion.button>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {/* Main Card */}
          <div className="glass-effect rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/20 dark:border-gray-700/30">
            
            {/* Header with enhanced design */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 text-white p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <div className="relative">
                    <h1 
                      className="text-3xl font-bold font-display cursor-pointer select-none hover:scale-105 transition-transform duration-200"
                      onClick={handleLogoClick}
                      title="MC Taxi"
                    >
                      MC Taxi
                    </h1>
                    {logoClickCount > 0 && logoClickCount < 7 && (
                      <div className="absolute -top-2 -right-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 7 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                i < logoClickCount 
                                  ? 'bg-yellow-400 scale-110' 
                                  : 'bg-white/30 scale-75'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-blue-100 text-lg font-medium font-display">Smart Fare Calculator</p>
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="p-8 space-y-8">
              
              {/* Enhanced Vehicle Selector */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <VehicleSelector 
                  selectedVehicle={vehicleType} 
                  onVehicleChange={setVehicleType} 
                />
              </motion.div>

              {/* Enhanced Distance Input */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <DistanceInput 
                  distance={distance} 
                  onDistanceChange={setDistance}
                  disabled={loading}
                />
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ErrorMessage message={error} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calculate Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                               <CalculateButton 
                 onClick={handleCalculateFare}
                 loading={loading}
                 disabled={!canCalculate}
               />
              </motion.div>

              {/* Fare Result */}
              <AnimatePresence>
                {fare !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <FareResult 
                      fare={fare}
                      distance={distance}
                      vehicleType={vehicleType}
                      breakdown={breakdown}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset Button */}
              <AnimatePresence>
                {showReset && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ResetButton onClick={reset} show={showReset} />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Enhanced Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Footer message="Base fare: ₱50 • Rate: ₱10-12/km" />
            </motion.div>
          </div>

          {/* Stats or additional info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center text-muted-foreground"
          >
            <p className="text-sm flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              Accurate fare calculation for Metro Manila
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Coming Soon Modal */}
      <Modal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        title="🚗 Car Calculations"
      >
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-bold font-display text-foreground mb-2">
            Coming Soon!
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Car fare calculations are currently under development. We're working hard to bring you this feature soon!
          </p>
          <p className="text-sm text-primary font-medium">
            For now, please use <strong>Motorcycle</strong> for your fare calculations.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </Modal>

      {/* Hidden Monitoring Modal */}
      <MonitoringModal
        isOpen={showMonitoringModal}
        onClose={() => setShowMonitoringModal(false)}
      />
    </div>
  );
}
