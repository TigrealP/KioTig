const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    happiness: {
        type: Number,
        default: 50,
        min: [0, 'La felicidad no puede ser negativa'],
        max: [100, 'La felicidad no puede superar 100']
    },
    streak: {
        type: Number,
        default: 0
    },
    lastInteraction: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Esto garantiza que la COMBINACIÓN user1+user2 sea única
relationshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model('Relationship', relationshipSchema);