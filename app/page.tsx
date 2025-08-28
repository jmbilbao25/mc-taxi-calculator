'use client';

import { useState } from 'react';

export default function TaxiFareCalculator() {
  const [distance, setDistance] = useState('');
  const [vehicleType, setVehicleType] = useState('motorcycle');
  const [fare, setFare] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Use EC2 backend URL - replace with your actual EC2 public IP
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.107.78.253:3001';
  
  // Ensure API_URL is always an absolute URL
  const getApiUrl = (endpoint: string) => {
    const baseUrl = API_URL.startsWith('http') ? API_URL : `http://${API_URL}`;
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }; 

  const handleCalculate = async () => {
    setError('');
    setFare(null);
    setBreakdown('');
    setLoading(true);

    const distanceValue = parseFloat(distance);
    
    if (isNaN(distanceValue) || distanceValue <= 0) {
      setError('Please enter a valid positive distance.');
      setLoading(false);
      return;
    }

    if (distanceValue < 1) {
      setError('Minimum distance is 1km.');
      setLoading(false);
      return;
    }

    if (distanceValue > 100) {
      setError('Distance cannot exceed 100km.');
      setLoading(false);
      return;
    }

         try {
       const apiUrl = getApiUrl('/api/calculate-fare');
       console.log('Making request to:', apiUrl);
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

       console.log('Response status:', response.status);
       console.log('Response headers:', response.headers);

       const data = await response.json();
       console.log('Response data:', data);

       if (data.success) {
         setFare(data.data.totalFare);
         setBreakdown(data.data.breakdown);
       } else {
         setError(data.message || 'Failed to calculate fare. Please try again.');
       }
     } catch (err) {
       console.error('API Error:', err);
       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
       setError(`Failed to connect to the server: ${errorMessage}. URL: ${getApiUrl('/api/calculate-fare')}`);
     } finally {
       setLoading(false);
     }
  };

  const handleReset = () => {
    setDistance('');
    setVehicleType('motorcycle');
    setFare(null);
    setBreakdown('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MC Taxi</h1>
          <h2 className="text-xl font-semibold text-gray-600">Fare Calculator</h2>
        </div>

        <div className="space-y-6">
          {/* Vehicle Type Selection */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
            >
              <option value="motorcycle">Motorcycle</option>
              <option value="car">Car</option>
            </select>
          </div>

          {/* Input Section */}
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">
              Distance (kilometers)
            </label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter distance (e.g., 5.5)"
              step="0.01"
              min="1"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Calculating...' : 'Calculate Fare'}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors duration-200"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {fare !== null && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Fare</h3>
                <div className="text-3xl font-bold text-green-600">
                  ₱{fare.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Vehicle: {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}
                </div>
              </div>
              
              <div className="border-t border-green-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Fare Breakdown:</h4>
                <div className="text-sm text-gray-600 whitespace-pre-line">
                  {breakdown}
                </div>
              </div>
            </div>
          )}

          {/* Fare Structure Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Fare Structure:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• 1-2km: ₱50.00 (base fare)</div>
              <div>• 3-8km: ₱50.00 + ₱10.00/km</div>
              <div>• 9km+: ₱50.00 + ₱60.00 + ₱12.00/km</div>
            </div>
          </div>

          {/* API Status */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Powered by MC Taxi API (EC2)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
