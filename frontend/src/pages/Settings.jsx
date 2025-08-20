import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, Eye, EyeOff, Save, Edit3, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SuccessModal from '../components/SuccessModal';

// This is the functional component for the Settings page.
const Settings = () => {
// Get the user object and functions from the authentication context.
const { user, updateProfile, changePassword, deleteAccount } = useAuth();
// State to toggle editing mode for profile information.
const [isEditing, setIsEditing] = useState(false);
// States to control the visibility of password fields.
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [showDeletePassword, setShowDeletePassword] = useState(false);

// State to manage the form data for user profile and password.
const [formData, setFormData] = useState({
name: user?.name || '',
email: user?.email || '',
phone: user?.phone || '',
location: user?.location || '',
currentPassword: '',
newPassword: '',
confirmPassword: '',
deletePassword: ''
});

// State for success modal
const [successModal, setSuccessModal] = useState({ isOpen: false, message: '', title: 'Success!' });

// State for delete confirmation
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

// State to manage application-specific settings.
const [appSettings, setAppSettings] = useState({
darkMode: false,
pushNotifications: true,
emailUpdates: true,
soundEffects: true
});

// Update form data when user changes
useEffect(() => {
if (user) {
setFormData(prev => ({
    ...prev,
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '+91 98765 43210',
    location: user.location || 'India'
}));
}
}, [user]);

// Function to handle saving profile changes.
const handleSave = async () => {
try {
const profileData = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    location: formData.location
};

await updateProfile(profileData);
setSuccessModal({ isOpen: true, message: 'Profile updated successfully!', title: 'Success!' });
setIsEditing(false);
} catch (error) {
setSuccessModal({ isOpen: true, message: error.message, title: 'Error!' });
}
};

// Function to handle password change.
const handlePasswordChange = async () => {
console.log('Password change attempt:', { 
    hasCurrentPassword: !!formData.currentPassword,
    hasNewPassword: !!formData.newPassword,
    hasConfirmPassword: !!formData.confirmPassword,
    passwordsMatch: formData.newPassword === formData.confirmPassword,
    newPasswordLength: formData.newPassword.length
});

// Validate current password is provided
if (!formData.currentPassword.trim()) {
setSuccessModal({ isOpen: true, message: 'Please enter your current password!', title: 'Error!' });
return;
}

// Validate new password is provided
if (!formData.newPassword.trim()) {
setSuccessModal({ isOpen: true, message: 'Please enter a new password!', title: 'Error!' });
return;
}

// Validate confirm password is provided
if (!formData.confirmPassword.trim()) {
setSuccessModal({ isOpen: true, message: 'Please confirm your new password!', title: 'Error!' });
return;
}

// Validate passwords match
if (formData.newPassword !== formData.confirmPassword) {
setSuccessModal({ isOpen: true, message: 'New passwords do not match!', title: 'Error!' });
return;
}

// Validate password length
if (formData.newPassword.length < 4) {
setSuccessModal({ isOpen: true, message: 'Password must be at least 4 characters long!', title: 'Error!' });
return;
}

try {
console.log('Sending password change request...');
const result = await changePassword({
    currentPassword: formData.currentPassword,
    newPassword: formData.newPassword
});

console.log('Password change result:', result);
setSuccessModal({ isOpen: true, message: 'Password changed successfully!', title: 'Success!' });

// Reset password fields after a successful change.
setFormData({
    ...formData,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});
} catch (error) {
console.error('Password change error:', error);
setSuccessModal({ isOpen: true, message: error.message, title: 'Error!' });
}
};

// Function to handle account deletion
const handleDeleteAccount = async () => {
if (!formData.deletePassword) {
setSuccessModal({ isOpen: true, message: 'Please enter your password to confirm deletion!', title: 'Error!' });
return;
}

try {
await deleteAccount(formData.deletePassword);
setSuccessModal({ isOpen: true, message: 'Account deleted successfully!', title: 'Success!' });
} catch (error) {
setSuccessModal({ isOpen: true, message: error.message, title: 'Error!' });
setShowDeleteConfirm(false);
}
};

return (
<div>
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header Section */}
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
        Manage your account preferences and security settings
        </p>
    </div>

    <div className="space-y-8">
        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Information
            </h2>
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
            </div>
        </div>

        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
                </label>
                <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
                />
                </div>
            </div>

            {/* Email Address Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
                </label>
                <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
                />
                </div>
            </div>

            {/* Phone Number Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
                </label>
                <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
                />
                </div>
            </div>

            {/* Location Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
                </label>
                <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
                />
                </div>
            </div>
            </div>

            {isEditing && (
            <div className="mt-6 flex justify-end">
                <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
                </button>
            </div>
            )}
        </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Change Password
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Update your password to keep your account secure
            </p>
        </div>

        <div className="p-6">
            <div className="space-y-6 max-w-md">
            {/* Current Password Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
                </label>
                <div className="relative">
                <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter current password"
                />
                <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                </div>
            </div>

            {/* New Password Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
                </label>
                <div className="relative">
                <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter new password"
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                </div>
            </div>

            {/* Confirm New Password Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
                </label>
                <div className="relative">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Confirm new password"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                </div>
            </div>

            <button
                onClick={handlePasswordChange}
                disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
                Update Password
            </button>
            </div>
        </div>
        </div>

        
        {/* Account Actions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account Actions
            </h2>
        </div>

        <div className="p-6">
            <div className="space-y-4">
            

            <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-left p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
                <h3 className="font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                Permanently delete your account and all associated data
                </p>
            </button>
            </div>
        </div>
        </div>
    </div>
    </div>
</div>

{/* Success Modal */}
<SuccessModal
    isOpen={successModal.isOpen}
    onClose={() => setSuccessModal({ isOpen: false, message: '', title: 'Success!' })}
    message={successModal.message}
    title={successModal.title}
/>

{/* Delete Account Confirmation Modal */}
{showDeleteConfirm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete Account
        </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
        This action cannot be undone. Please enter your password to confirm account deletion.
        </p>
        
        <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
        </label>
        <div className="relative">
            <input
            type={showDeletePassword ? 'text' : 'password'}
            value={formData.deletePassword}
            onChange={(e) => setFormData({ ...formData, deletePassword: e.target.value })}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter your password"
            />
            <button
            type="button"
            onClick={() => setShowDeletePassword(!showDeletePassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
            {showDeletePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
        </div>
        </div>
        
        <div className="flex space-x-3">
        <button
            onClick={() => {
            setShowDeleteConfirm(false);
            setFormData({ ...formData, deletePassword: '' });
            }}
            className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
            Cancel
        </button>
        <button
            onClick={handleDeleteAccount}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
            Delete Account
        </button>
        </div>
    </div>
    </div>
)}
</div>
);
};

export default Settings;
