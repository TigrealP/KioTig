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
    // 📸 Contadores de momentos
    moments: {
        kisses: { type: Number, default: 0 },
        hugs: { type: Number, default: 0 },
        sleeps: { type: Number, default: 0 },
        fucks: { type: Number, default: 0 },
        actions: { type: Number, default: 0 }
    },
    lastMoment: {
        type: String,
        default: null
    },
    lastMomentAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

relationshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model('Relationship', relationshipSchema);