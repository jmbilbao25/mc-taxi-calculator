'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Edit, Plus, Trash2, Save, X, DollarSign, MapPin, Car, Bike, Truck, Zap } from 'lucide-react';

interface FareConfig {
  id: number;
  vehicle_type: string;
  min_distance: number | string;
  max_distance: number | string;
  base_price: number | string;
  price_per_km: number | string;
  vehicle_display_name: string;
  icon: string;
  is_active: boolean;
  updated_at: string;
}

interface VehicleType {
  id: number;
  name: string;
  display_name: string;
  icon: string;
}

const FareConfigPanel = () => {
  const [configs, setConfigs] = useState<FareConfig[]>([]);
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [showDeleteVehicleModal, setShowDeleteVehicleModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [editForm, setEditForm] = useState({
    min_distance: 0,
    max_distance: 0,
    base_price: 0,
    price_per_km: 0
  });

  const [addForm, setAddForm] = useState({
    vehicle_type: '',
    min_distance: 0,
    max_distance: 0,
    base_price: 0,
    price_per_km: 0
  });

  const [addVehicleForm, setAddVehicleForm] = useState({
    name: '',
    display_name: '',
    icon: 'car'
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://35.74.250.160:3001';

  useEffect(() => {
    fetchConfigs();
    fetchVehicles();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/fare-config/configs`);
      const data = await response.json();
      if (data.success) {
        console.log('Fetched configs:', data.data);
        setConfigs(data.data);
      } else {
        setError(data.error || 'Failed to fetch fare configurations');
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
      setError('Failed to fetch fare configurations');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/fare-config/vehicles`);
      const data = await response.json();
      if (data.success) {
        console.log('Fetched vehicles:', data.data);
        setVehicles(data.data);
        // Auto-select first vehicle if none selected
        if (data.data.length > 0 && !selectedVehicle) {
          setSelectedVehicle(data.data[0].name);
        }
      } else {
        setError(data.error || 'Failed to fetch vehicle types');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to fetch vehicle types');
    }
  };

  const handleEdit = (config: FareConfig) => {
    setEditingId(config.id);
    setEditForm({
      min_distance: typeof config.min_distance === 'string' ? parseFloat(config.min_distance) : config.min_distance,
      max_distance: typeof config.max_distance === 'string' ? parseFloat(config.max_distance) : config.max_distance,
      base_price: typeof config.base_price === 'string' ? parseFloat(config.base_price) : config.base_price,
      price_per_km: typeof config.price_per_km === 'string' ? parseFloat(config.price_per_km) : config.price_per_km
    });
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/fare-config/configs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Fare configuration updated successfully!');
        setEditingId(null);
        fetchConfigs();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to update configuration');
      }
    } catch (error) {
      setError('Failed to update configuration');
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/fare-config/configs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('New fare configuration created successfully!');
        setShowAddForm(false);
        setAddForm({
          vehicle_type: '',
          min_distance: 0,
          max_distance: 0,
          base_price: 0,
          price_per_km: 0
        });
        fetchConfigs();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to create configuration');
      }
    } catch (error) {
      setError('Failed to create configuration');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/fare-config/configs/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Configuration deleted successfully!');
        fetchConfigs();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to delete configuration');
      }
    } catch (error) {
      setError('Failed to delete configuration');
    }
  };

  const handleAddVehicle = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/fare-config/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addVehicleForm)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('New vehicle type created successfully!');
        setShowAddVehicleForm(false);
        setAddVehicleForm({
          name: '',
          display_name: '',
          icon: 'car'
        });
        fetchVehicles();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to create vehicle type');
      }
    } catch (error) {
      setError('Failed to create vehicle type');
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    try {
      const response = await fetch(`${API_BASE}/api/fare-config/vehicles/${vehicleToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Vehicle type deleted successfully');
        setShowDeleteVehicleModal(false);
        setVehicleToDelete(null);
        
        // If the deleted vehicle was selected, clear selection
        if (selectedVehicle === vehicleToDelete.name) {
          setSelectedVehicle('');
        }
        
        fetchVehicles();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        // Handle specific error cases
        let errorMessage = data.error || 'Failed to delete vehicle type';
        if (data.details) {
          errorMessage += `: ${data.details}`;
        }
        setError(errorMessage);
      }
    } catch (error) {
      setError('Network error: Failed to delete vehicle type');
    }
  };

  const openDeleteVehicleModal = (vehicle: VehicleType) => {
    setVehicleToDelete(vehicle);
    setShowDeleteVehicleModal(true);
  };

  const getVehicleIcon = (icon: string) => {
    switch (icon) {
      case 'car': return <Car className="w-5 h-5" />;
      case 'bike': return <Bike className="w-5 h-5" />;
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₱${isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get filtered configs for selected vehicle
  const filteredConfigs = configs.filter(config => config.vehicle_type === selectedVehicle);
  const selectedVehicleData = vehicles.find(v => v.name === selectedVehicle);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fare Configuration Panel
          </h1>
        </div>
        
        {/* Vehicle Selector */}
        <div className="max-w-md mx-auto mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Vehicle Type
          </label>
          <div className="flex space-x-2">
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
              <option value="">Choose a vehicle type...</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.name}>
                  {vehicle.display_name}
                </option>
              ))}
            </select>
            {selectedVehicle && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const vehicle = vehicles.find(v => v.name === selectedVehicle);
                  if (vehicle) openDeleteVehicleModal(vehicle);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center transition-colors"
                title="Delete vehicle type"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {selectedVehicle && (
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddVehicleForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Service</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Fare Rule</span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between"
          >
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Add New Fare Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={addForm.vehicle_type}
                    onChange={(e) => setAddForm({ ...addForm, vehicle_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select vehicle type</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.name}>
                        {vehicle.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Min Distance (km)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={addForm.min_distance}
                      onChange={(e) => setAddForm({ ...addForm, min_distance: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Distance (km)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={addForm.max_distance}
                      onChange={(e) => setAddForm({ ...addForm, max_distance: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Base Price (₱)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={addForm.base_price}
                      onChange={(e) => setAddForm({ ...addForm, base_price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price per km (₱)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={addForm.price_per_km}
                      onChange={(e) => setAddForm({ ...addForm, price_per_km: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Configuration
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Vehicle Type Modal */}
      <AnimatePresence>
        {showAddVehicleForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Add New Service Type
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Name (internal)
                  </label>
                  <input
                    type="text"
                    value={addVehicleForm.name}
                    onChange={(e) => setAddVehicleForm({ ...addVehicleForm, name: e.target.value })}
                    placeholder="e.g., taxi, bus, jeepney"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={addVehicleForm.display_name}
                    onChange={(e) => setAddVehicleForm({ ...addVehicleForm, display_name: e.target.value })}
                    placeholder="e.g., Taxi, Bus, Jeepney"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <select
                    value={addVehicleForm.icon}
                    onChange={(e) => setAddVehicleForm({ ...addVehicleForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="truck">Truck</option>
                    <option value="zap">Zap (Motorcycle)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddVehicle}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Service
                </button>
                <button
                  onClick={() => setShowAddVehicleForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Vehicle Confirmation Modal */}
      <AnimatePresence>
        {showDeleteVehicleModal && vehicleToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete Vehicle Type
                </h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to delete the vehicle type <strong>"{vehicleToDelete.display_name}"</strong>?
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This action cannot be undone. If there are active fare configurations for this vehicle type, the deletion will be prevented.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteVehicle}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => {
                    setShowDeleteVehicleModal(false);
                    setVehicleToDelete(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fare Structure Display */}
      {selectedVehicle && selectedVehicleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-white">
                  {getVehicleIcon(selectedVehicleData.icon)}
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {selectedVehicleData.display_name} Fare Structure
                </h2>
              </div>
              <div className="text-white text-sm">
                {filteredConfigs.length} fare rules
              </div>
            </div>
          </div>

          {/* Fare Rules */}
          <div className="p-6">
            {filteredConfigs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No fare rules configured for {selectedVehicleData.display_name}</p>
                <p className="text-sm mt-2">Click "Add Fare Rule" to create the first rule</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConfigs.map((config, index) => (
                  <motion.div
                    key={config.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {editingId === config.id ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Min Distance (km)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.min_distance}
                            onChange={(e) => setEditForm({ ...editForm, min_distance: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Max Distance (km)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.max_distance}
                            onChange={(e) => setEditForm({ ...editForm, max_distance: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Base Price (₱)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.base_price}
                            onChange={(e) => setEditForm({ ...editForm, base_price: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price per km (₱)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.price_per_km}
                            onChange={(e) => setEditForm({ ...editForm, price_per_km: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {config.min_distance} - {config.max_distance} km
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600 dark:text-gray-400">
                              Base: {formatPrice(config.base_price)}
                            </span>
                          </div>
s                          <div className="text-gray-600 dark:text-gray-400">
                            Per km: {formatPrice(config.price_per_km)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(config)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(config.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {editingId === config.id && (
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => handleSave(config.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center space-x-1"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* No Vehicle Selected Message */}
      {!selectedVehicle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Select a Vehicle Type</h3>
          <p>Choose a vehicle type from the dropdown above to view and manage its fare structure.</p>
        </motion.div>
      )}
    </div>
  );
};

export default FareConfigPanel;
