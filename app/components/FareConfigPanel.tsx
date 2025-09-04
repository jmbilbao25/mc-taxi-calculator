'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Edit, Plus, Trash2, Save, X, DollarSign, MapPin, Car, Bike, Truck, Motorcycle } from 'lucide-react';

interface FareConfig {
  id: number;
  vehicle_type: string;
  min_distance: number;
  max_distance: number;
  base_price: number;
  price_per_km: number;
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
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchConfigs();
    fetchVehicles();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/fare-config/configs`);
      const data = await response.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (error) {
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
        setVehicles(data.data);
      }
    } catch (error) {
      setError('Failed to fetch vehicle types');
    }
  };

  const handleEdit = (config: FareConfig) => {
    setEditingId(config.id);
    setEditForm({
      min_distance: config.min_distance,
      max_distance: config.max_distance,
      base_price: config.base_price,
      price_per_km: config.price_per_km
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

  const getVehicleIcon = (icon: string) => {
    switch (icon) {
      case 'car': return <Car className="w-5 h-5" />;
      case 'bike': return <Bike className="w-5 h-5" />;
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'motorcycle': return <Motorcycle className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const formatPrice = (price: number) => `₱${price.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fare Configuration Panel
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Configuration</span>
        </motion.button>
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

      {/* Configurations Grid */}
      <div className="grid gap-6">
        {vehicles.map(vehicle => {
          const vehicleConfigs = configs.filter(config => config.vehicle_type === vehicle.name);
          
          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="text-white">
                    {getVehicleIcon(vehicle.icon)}
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {vehicle.display_name} Fare Structure
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {vehicleConfigs.map((config, index) => (
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
                              Min Distance
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
                              Max Distance
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
                              Base Price
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
                              Price per km
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {config.min_distance} - {config.max_distance} km
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Base: {formatPrice(config.base_price)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Per km: {formatPrice(config.price_per_km)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              Total: {formatPrice(config.base_price + (config.max_distance * config.price_per_km))}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 mt-4">
                        {editingId === config.id ? (
                          <>
                            <button
                              onClick={() => handleSave(config.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FareConfigPanel;
