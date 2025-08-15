import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Car, Bike, Battery } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEV } from '../contexts/EVContext';

// This is the functional component for the onboarding process.
const Onboarding = () => {
// State to track the current step of the onboarding process.
const [currentStep, setCurrentStep] = useState(1);
// State to hold the form data for the new EV.
const [formData, setFormData] = useState({
type: '',
brand: '',
model: '',
batteryCapacity: 0,
range: 0,
isDefault: true
});

// Hooks for authentication and EV management.
const { completeOnboarding } = useAuth();
const { addEV } = useEV();
const navigate = useNavigate();

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

// Calculate battery percentage for the visualizer.
const batteryPercentage = formData.batteryCapacity > 0 ? Math.min((formData.batteryCapacity / 100) * 100, 100) : 0;

// Function to move to the next step.
const handleNext = () => {
if (currentStep < 3) {
    setCurrentStep(currentStep + 1);
}
};

// Function to move to the previous step.
const handleBack = () => {
if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
}
};

// Function to handle the final submission of the form.
const handleSubmit = () => {
// Only submit if all required fields are filled.
if (formData.type && formData.brand && formData.model && formData.batteryCapacity && formData.range) {
    addEV(formData);
    completeOnboarding();
    navigate('/dashboard');
}
};

// Function to check if a step is complete to enable navigation.
const isStepComplete = (step) => {
switch (step) {
    case 1:
    return formData.type !== '';
    case 2:
    return formData.brand !== '' && formData.model !== '';
    case 3:
    return formData.batteryCapacity > 0 && formData.range > 0;
    default:
    return false;
}
};

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
    <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Let's set up your EV
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
        Tell us about your electric vehicle to get personalized recommendations
        </p>
    </div>

    {/* Progress Bar */}
    <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
        {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
            >
                {isStepComplete(step) ? <Check className="h-5 w-5" /> : step}
            </div>
            {step < 3 && (
                <div
                className={`w-20 h-1 mx-4 ${
                    currentStep > step
                    ? 'bg-emerald-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                />
            )}
            </div>
        ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Vehicle Type</span>
        <span>Brand & Model</span>
        <span>Specifications</span>
        </div>
    </div>

    {/* Step Content */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {currentStep === 1 && (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Choose your vehicle type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
                onClick={() => setFormData({ ...formData, type: '2W' })}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                formData.type === '2W'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500'
                }`}
            >
                <Bike className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Two Wheeler
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                Electric scooters and motorcycles
                </p>
            </button>

            <button
                onClick={() => setFormData({ ...formData, type: '4W' })}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                formData.type === '4W'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500'
                }`}
            >
                <Car className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Four Wheeler
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                Electric cars and SUVs
                </p>
            </button>
            </div>
        </div>
        )}

        {currentStep === 2 && (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Select your brand and model
            </h2>
            <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand
                </label>
                <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: '' })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                <option value="">Select a brand</option>
                {formData.type && evBrands[formData.type].map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                ))}
                </select>
            </div>

            {formData.brand && (
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model
                </label>
                <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                    <option value="">Select a model</option>
                    {evModels[formData.brand]?.map((model) => (
                    <option key={model} value={model}>{model}</option>
                    ))}
                </select>
                </div>
            )}
            </div>
        </div>
        )}

        {currentStep === 3 && (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Enter specifications
            </h2>
            <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Battery Capacity (kWh)
                </label>
                <input
                type="number"
                value={formData.batteryCapacity || ''}
                onChange={(e) => setFormData({ ...formData, batteryCapacity: Number(e.target.value) })}
                placeholder="e.g., 40"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Range (km)
                </label>
                <input
                type="number"
                value={formData.range || ''}
                onChange={(e) => setFormData({ ...formData, range: Number(e.target.value) })}
                placeholder="e.g., 300"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>

            {/* Battery Visualization */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                <Battery className="h-8 w-8 text-emerald-600" />
                <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Battery Capacity</span>
                    <span>{formData.batteryCapacity} kWh</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(batteryPercentage, 100)}%` }}
                    ></div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
        <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
        </button>

        {currentStep < 3 ? (
            <button
            onClick={handleNext}
            disabled={!isStepComplete(currentStep)}
            className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            Next
            <ChevronRight className="h-5 w-5 ml-2" />
            </button>
        ) : (
            <button
            onClick={handleSubmit}
            disabled={!isStepComplete(3)}
            className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            Complete Setup
            <Check className="h-5 w-5 ml-2" />
            </button>
        )}
        </div>
    </div>
    </div>
</div>
);
};

export default Onboarding;
