const EVModel = require("../Models/EV");

// Get all EVs for a user
const getUserEVs = async (req, res) => {
    try {
        const userId = req.user._id;
        const evs = await EVModel.find({ userId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: evs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Add a new EV
const addEV = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, brand, model, batteryCapacity, currentCharge, fullRange, isDefault } = req.body;

        // Validate required fields
        if (!type || !brand || !model || !batteryCapacity || !currentCharge || !fullRange) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate battery capacity and current charge
        if (currentCharge > batteryCapacity) {
            return res.status(400).json({
                success: false,
                message: "Current charge cannot exceed battery capacity"
            });
        }

        // If this is the first EV or isDefault is true, set it as default
        const existingEVs = await EVModel.find({ userId });
        const shouldBeDefault = existingEVs.length === 0 || isDefault;

        const newEV = new EVModel({
            userId,
            type,
            brand,
            model,
            batteryCapacity,
            currentCharge,
            fullRange,
            isDefault: shouldBeDefault
        });

        await newEV.save();

        res.status(201).json({
            success: true,
            message: "EV added successfully",
            data: newEV
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update an EV
const updateEV = async (req, res) => {
    try {
        const userId = req.user._id;
        const evId = req.params.id;
        const updates = req.body;

        // Check if EV belongs to user
        const ev = await EVModel.findOne({ _id: evId, userId });
        if (!ev) {
            return res.status(404).json({
                success: false,
                message: "EV not found"
            });
        }

        // Update the EV
        const updatedEV = await EVModel.findByIdAndUpdate(
            evId,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "EV updated successfully",
            data: updatedEV
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete an EV
const deleteEV = async (req, res) => {
    try {
        const userId = req.user._id;
        const evId = req.params.id;

        // Check if EV belongs to user
        const ev = await EVModel.findOne({ _id: evId, userId });
        if (!ev) {
            return res.status(404).json({
                success: false,
                message: "EV not found"
            });
        }

        // If this was the default EV, set another one as default
        if (ev.isDefault) {
            const otherEVs = await EVModel.find({ userId, _id: { $ne: evId } });
            if (otherEVs.length > 0) {
                await EVModel.findByIdAndUpdate(otherEVs[0]._id, { isDefault: true });
            }
        }

        await EVModel.findByIdAndDelete(evId);

        res.status(200).json({
            success: true,
            message: "EV deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Set an EV as default
const setDefaultEV = async (req, res) => {
    try {
        const userId = req.user._id;
        const evId = req.params.id;

        // Check if EV belongs to user
        const ev = await EVModel.findOne({ _id: evId, userId });
        if (!ev) {
            return res.status(404).json({
                success: false,
                message: "EV not found"
            });
        }

        // Set all other EVs to not default
        await EVModel.updateMany(
            { userId, _id: { $ne: evId } },
            { isDefault: false }
        );

        // Set this EV as default
        const updatedEV = await EVModel.findByIdAndUpdate(
            evId,
            { isDefault: true },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Default EV updated successfully",
            data: updatedEV
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get default EV for user
const getDefaultEV = async (req, res) => {
    try {
        const userId = req.user._id;
        const defaultEV = await EVModel.findOne({ userId, isDefault: true });
        
        res.status(200).json({
            success: true,
            data: defaultEV
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getUserEVs,
    addEV,
    updateEV,
    deleteEV,
    setDefaultEV,
    getDefaultEV
};
