const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EVSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    type: {
        type: String,
        enum: ['2W', '4W'],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    batteryCapacity: {
        type: Number,
        required: true
    },
    currentCharge: {
        type: Number,
        required: true
    },
    fullRange: {
        type: Number,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for battery percentage
EVSchema.virtual('batteryPercentage').get(function() {
    if (this.batteryCapacity && this.currentCharge) {
        return Math.round((this.currentCharge / this.batteryCapacity) * 100);
    }
    return 0;
});

// Virtual for current range (calculated from percentage)
EVSchema.virtual('currentRange').get(function() {
    if (this.fullRange && this.batteryPercentage) {
        return Math.round((this.batteryPercentage / 100) * this.fullRange);
    }
    return 0;
});

// Virtual for battery condition
EVSchema.virtual('batteryCondition').get(function() {
    const percentage = this.batteryPercentage;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 50) return 'Good';
    if (percentage >= 20) return 'Low';
    return 'Critical';
});

// Ensure virtuals are included in JSON output
EVSchema.set('toJSON', { virtuals: true });
EVSchema.set('toObject', { virtuals: true });

// Ensure only one EV per user can be default
EVSchema.pre('save', async function(next) {
    if (this.isDefault) {
        await this.constructor.updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

const EVModel = mongoose.model('evs', EVSchema);
module.exports = EVModel;
