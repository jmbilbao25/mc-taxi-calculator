'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import VehicleSelector from './components/VehicleSelector';
import DistanceInput from './components/DistanceInput';
import ErrorMessage from './components/ErrorMessage';
import CalculateButton from './components/CalculateButton';
import FareResult from './components/FareResult';
import ResetButton from './components/ResetButton';
import Footer from './components/Footer';
import { useFareCalculator } from './hooks/useFareCalculator';

export default function TaxiFareCalculator() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    distance,
    vehicleType,
    fare,
    breakdown,
    error,
    loading,
    setDistance,
    setVehicleType,
    calculateFare,
    reset,
    canCalculate,
    showReset
  } = useFareCalculator();

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
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 rounded-full glass-effect hover:scale-110 transition-all duration-300 group"
      >
        {darkMode ? (
          <span className="text-yellow-500 text-xl">☀️</span>
        ) : (
          <span className="text-blue-600 text-xl">🌙</span>
        )}
      </button>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg animate-fade-in">
          {/* Main Card */}
          <div className="glass-effect rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/20 dark:border-gray-700/30">
            
            {/* Header with enhanced design */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 text-white p-8 text-center overflow-hidden">
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <span className="text-2xl">🧮</span>
                  </div>
                  <h1 className="text-3xl font-bold">MC Taxi</h1>
                  <span className="text-yellow-300 text-xl animate-pulse">✨</span>
                </div>
                <p className="text-blue-100 text-lg font-medium">Smart Fare Calculator</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              
              <VehicleSelector 
                selectedVehicle={vehicleType} 
                onVehicleChange={setVehicleType} 
              />

              <DistanceInput 
                distance={distance} 
                onDistanceChange={setDistance}
                disabled={loading}
              />

              {error && (
                <ErrorMessage message={error} />
              )}

              <CalculateButton 
                onClick={calculateFare}
                loading={loading}
                disabled={!canCalculate}
              />

              {fare !== null && (
                <FareResult 
                  fare={fare}
                  distance={distance}
                  vehicleType={vehicleType}
                  breakdown={breakdown}
                />
              )}

              {showReset && (
                <ResetButton onClick={reset} show={showReset} />
              )}

            </div>

            <Footer message="Base fare: ₱50 • Rate: ₱10-12/km" />
          </div>

          {/* Stats or additional info */}
          <div className="mt-6 text-center text-muted-foreground">
            <p className="text-sm flex items-center justify-center gap-2">
              <span>📍</span>
              Accurate fare calculation for Metro Manila
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
