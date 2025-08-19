const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const authMiddleware = require('../Middlewares/Auth');
const { changePasswordValidation } = require('../Middlewares/AuthValidation');

// Apply authentication middleware to all user routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', UserController.getUserProfile);

// Update user profile
router.put('/profile', UserController.updateProfile);

// Change password
router.put('/password', changePasswordValidation, UserController.changePassword);

// Delete account
router.delete('/account', UserController.deleteAccount);

module.exports = router;
