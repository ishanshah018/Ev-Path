const express = require('express');
const router = express.Router();
const EVController = require('../Controllers/EVController');
const authMiddleware = require('../Middlewares/Auth');

// Apply authentication middleware to all EV routes
router.use(authMiddleware);

// Get all EVs for the authenticated user
router.get('/', EVController.getUserEVs);

// Get default EV for the authenticated user
router.get('/default', EVController.getDefaultEV);

// Add a new EV
router.post('/', EVController.addEV);

// Update an EV
router.put('/:id', EVController.updateEV);

// Delete an EV
router.delete('/:id', EVController.deleteEV);

// Set an EV as default
router.patch('/:id/default', EVController.setDefaultEV);

module.exports = router;
