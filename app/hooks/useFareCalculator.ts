import { useState } from 'react';

interface FareCalculationResult {
  success: boolean;
  data?: {
    totalFare: number;
    breakdown: string;
  };
  message?: string;
}

export function useFareCalculator() {
  const [distance, setDistance] = useState('');
  const [vehicleType, setVehicleType] = useState('motorcycle');
  const [fare, setFare] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Keep track of calculation attempts - useful for analytics later
  const [calculationAttempts, setCalculationAttempts] = useState(0);

  // Backend API URL configuration
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  const getApiUrl = (endpoint: string) => {
    const baseUrl = API_URL.startsWith('http') ? API_URL : `http://${API_URL}`;
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  };

  const validateDistance = (distanceValue: number): string | null => {
    if (isNaN(distanceValue) || distanceValue <= 0) {
      return 'Please enter a valid positive distance.';
    }
    if (distanceValue < 1) {
      return 'Minimum distance is 1km.';
    }
    if (distanceValue > 1000) {
      return 'Distance cannot exceed 1000km.';
    }
    return null;
  };

  const calculateFare = async () => {
    // Increment attempt counter
    setCalculationAttempts(prev => prev + 1);
    
    setError('');
    setFare(null);
    setBreakdown('');
    setLoading(true);

    const distanceValue = parseFloat(distance);
    
    // Add a small delay to show loading state - could be optimized
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const validationError = validateDistance(distanceValue);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Use the new database-driven fare calculation endpoint
      const apiUrl = getApiUrl('/api/fare-config/calculate');
      // Debug logs - should be removed in production
      if (process.env.NODE_ENV === 'development') {
        console.log('Making request to:', apiUrl);
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distance: distanceValue,
          vehicleType: vehicleType,
          clientId: 'web-user'
        }),
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('Response status:', response.status);
      }
      const data = await response.json();
      
      // Log response for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Response data:', data);
      }

      if (data.success && data.data) {
        setFare(data.data.fare);
        setBreakdown(data.data.breakdown.calculation);
      } else {
        setError(data.message || 'Failed to calculate fare. Please try again.');
      }
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to connect to the server: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDistance('');
    setVehicleType('motorcycle');
    setFare(null);
    setBreakdown('');
    setError('');
  };

  return {
    // State
    distance,
    vehicleType,
    fare,
    breakdown,
    error,
    loading,
    // Actions
    setDistance,
    setVehicleType,
    calculateFare,
    reset,
    // Computed
    canCalculate: distance.trim() !== '' && !loading,
    showReset: fare !== null || error !== ''
  };
}
