import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Star, Battery, Car, Bike, Settings, TrendingUp, Activity } from 'lucide-react';
import { useEV } from '../contexts/EVContext';

// This is the functional component for the Manage EVs page.
const ManageEV = () => {
// Destructure functions and state from the EV context.
const { evs, addEV, updateEV, deleteEV, setDefaultEV } = useEV();
// State to control the visibility of the add/edit form.
const [showAddForm, setShowAddForm] = useState(false);
// State to hold the EV currently being edited.
const [editingEV, setEditingEV] = useState(null);
// State to manage the form data.
const [formData, setFormData] = useState({
type: '4W',
brand: '',
model: '',
batteryCapacity: 0,
range: 0,
isDefault: false
});

// Hardcoded data for EV brands based on vehicle type.
const evBrands = {
'2W': ['Hero Electric', 'Bajaj', 'TVS', 'Ather', 'Ola Electric', 'Ampere'],
'4W': ['Tesla', 'Tata', 'Mahindra', 'BMW', 'Audi', 'Hyundai', 'MG Motor']
};

// Hardcoded data for EV models based on brand.
const evModels = {
'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
'Tata': ['Nexon EV', 'Tigor EV', 'Tiago EV'],
'Mahindra': ['eXUV300', 'eKUV100', 'eVerito'],
'Hero Electric': ['Optima', 'Photon', 'NYX'],
'Ather': ['450X', '450 Plus'],
'Ola Electric': ['S1', 'S1 Pro'],
'BMW': ['iX3', 'i4', 'iX'],
'Audi': ['e-tron', 'e-tron GT', 'Q4 e-tron'],
'Hyundai': ['Kona Electric', 'Ioniq 5'],
'MG Motor': ['ZS EV', 'Comet EV'],
'Bajaj': ['Chetak Electric'],
'TVS': ['iQube Electric'],
'Ampere': ['Magnus', 'Reo Plus']
};

// Function to reset the form to its initial state.
const resetForm = () => {
setFormData({
    type: '4W',
    brand: '',
    model: '',
    batteryCapacity: 0,
    range: 0,
    isDefault: false
});
setEditingEV(null);
setShowAddForm(false);
};

// Function to handle form submission for both adding and editing.
const handleSubmit = (e) => {
e.preventDefault();
if (editingEV) {
    updateEV(editingEV.id, formData);
} else {
    addEV(formData);
}
resetForm();
};

// Function to populate the form with data for editing a specific EV.
const handleEdit = (ev) => {
setFormData({
    type: ev.type,
    brand: ev.brand,
    model: ev.model,
    batteryCapacity: ev.batteryCapacity,
    range: ev.range,
    isDefault: ev.isDefault
});
setEditingEV(ev);
setShowAddForm(true);
};

// Function to handle deleting an EV.
const handleDelete = (id) => {
// Note: The original code used `confirm()`, which is not available in this environment.
// In a real application, you'd use a custom modal for confirmation.
if (window.confirm('Are you sure you want to delete this EV?')) {
    deleteEV(id);
}
};

// Function to set an EV as the default.
const handleSetDefault = (id) => {
setDefaultEV(id);
};

// Functions to determine color classes for battery health display.
const batteryHealthColor = (health) => {
if (health >= 90) return 'text-green-600';
if (health >= 70) return 'text-yellow-600';
return 'text-red-600';
};

const batteryHealthBg = (health) => {
if (health >= 90) return 'bg-green-100 dark:bg-green-900/20';
if (health >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
return 'bg-red-100 dark:bg-red-900/20';
};

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header Section */}
    <div className="mb-8">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Electric Vehicles</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your EVs and track their performance
            </p>
        </div>
        <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
            <Plus className="h-5 w-5 mr-2" />
            Add EV
        </button>
        </div>
    </div>

    {/* Add/Edit Form Modal */}
    {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingEV ? 'Edit EV' : 'Add New EV'}
                </h2>
                <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                ×
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle Type Selection */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vehicle Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: '2W', brand: '', model: '' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === '2W'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                    }`}
                    >
                    <Bike className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">2 Wheeler</span>
                    </button>
                    <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: '4W', brand: '', model: '' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === '4W'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                    }`}
                    >
                    <Car className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">4 Wheeler</span>
                    </button>
                </div>
                </div>

                {/* Brand Dropdown */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brand
                </label>
                <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: '' })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                >
                    <option value="">Select a brand</option>
                    {evBrands[formData.type].map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
                </div>

                {/* Model Dropdown (conditionally rendered) */}
                {formData.brand && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model
                    </label>
                    <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    >
                    <option value="">Select a model</option>
                    {evModels[formData.brand]?.map((model) => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                    </select>
                </div>
                )}

                {/* Battery Capacity Input */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Battery Capacity (kWh)
                </label>
                <input
                    type="number"
                    value={formData.batteryCapacity || ''}
                    onChange={(e) => setFormData({ ...formData, batteryCapacity: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 40"
                    required
                />
                </div>

                {/* Range Input */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Range (km)
                </label>
                <input
                    type="number"
                    value={formData.range || ''}
                    onChange={(e) => setFormData({ ...formData, range: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 300"
                    required
                />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    {editingEV ? 'Update EV' : 'Add EV'}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    )}

    {/* EV Grid */}
    {evs.length === 0 ? (
        <div className="text-center py-12">
        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No EVs Added Yet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add your first electric vehicle to start tracking its performance
        </p>
        <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First EV
        </button>
        </div>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evs.map((ev) => (
            <div key={ev.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {ev.type === '2W' ? (
                    <Bike className="h-8 w-8 text-emerald-600" />
                    ) : (
                    <Car className="h-8 w-8 text-emerald-600" />
                    )}
                    <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ev.brand} {ev.model}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ev.batteryCapacity} kWh • {ev.range} km range
                    </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {ev.isDefault && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    )}
                    <div className="flex items-center space-x-1">
                    <button
                        onClick={() => handleEdit(ev)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(ev.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    </div>
                </div>
                </div>

                {/* Battery Status */}
                <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Charge</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{ev.currentCharge}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                        ev.currentCharge > 50 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                        ev.currentCharge > 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${ev.currentCharge}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>0%</span>
                    <span>{Math.round(ev.range * (ev.currentCharge / 100))} km remaining</span>
                    <span>100%</span>
                </div>
                </div>

                {/* Battery Health */}
                <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Battery Health</span>
                    <span className={`text-sm font-bold ${batteryHealthColor(ev.batteryHealth)}`}>
                    {ev.batteryHealth.toFixed(1)}%
                    </span>
                </div>
                <div className={`p-3 rounded-lg ${batteryHealthBg(ev.batteryHealth)}`}>
                    <div className="flex items-center space-x-2">
                    <Activity className={`h-4 w-4 ${batteryHealthColor(ev.batteryHealth)}`} />
                    <span className={`text-sm font-medium ${batteryHealthColor(ev.batteryHealth)}`}>
                        {ev.batteryHealth >= 90 ? 'Excellent' : ev.batteryHealth >= 70 ? 'Good' : 'Fair'}
                    </span>
                    </div>
                </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                {!ev.isDefault && (
                    <button
                    onClick={() => handleSetDefault(ev.id)}
                    className="flex-1 py-2 px-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm font-medium"
                    >
                    Set as Default
                    </button>
                )}
                <button className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                    <Settings className="h-4 w-4 inline mr-1" />
                    Settings
                </button>
                </div>
            </div>
            </div>
        ))}
        </div>
    )}
    </div>
</div>
);
};

export default ManageEV;
