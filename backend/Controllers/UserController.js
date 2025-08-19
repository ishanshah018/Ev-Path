const UserModel = require("../Models/User");
const bcrypt = require('bcrypt');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, phone, location } = req.body;

        // Check if email is being changed and if it's already taken
        if (email) {
            const existingUser = await UserModel.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email, phone, location },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        console.log('Password change request:', { userId, hasCurrentPassword: !!currentPassword, hasNewPassword: !!newPassword });

        // Get user with password
        const user = await UserModel.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        console.log('Current password validation:', { isValid: isCurrentPasswordValid });
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Check if new password is different from current password
        const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
        console.log('New password same as current:', { isSame: isNewPasswordSame });
        if (isNewPasswordSame) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password"
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await UserModel.findByIdAndUpdate(userId, { password: hashedNewPassword });
        console.log('Password updated successfully for user:', userId);

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (err) {
        console.error('Password change error:', err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete user account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;

        // Get user with password
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            });
        }

        // Delete user
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getUserProfile,
    updateProfile,
    changePassword,
    deleteAccount
};
