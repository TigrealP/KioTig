const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    value: { type: Number, default: 50, min: 0, max: 100 },
    unlocked: { type: Boolean, default: false }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    characterName: String,
    description: String,
    image: String,
    isPublic: {
        type: Boolean,
        default: false
    },
    stats: {
        dominancia:  { ...statSchema.obj },
        sumision:    { ...statSchema.obj },
        afecto:      { ...statSchema.obj },
        picardía:    { ...statSchema.obj },
        lealtad:     { ...statSchema.obj },
        nostalgia:   { ...statSchema.obj },
        peso:        { ...statSchema.obj },
        deseo:       { ...statSchema.obj },
        dolor:       { ...statSchema.obj },
        control:     { ...statSchema.obj },
        apego:       { ...statSchema.obj }
    },

    // 📦 Exportaciones (array para múltiples)
    exportedProfiles: [{
        name:        { type: String, required: true },
        description: { type: String, required: true },
        image:       { type: String, default: null },
        publicId:    { type: String, default: null },
        exportedAt:  { type: Date, default: Date.now }
    }],

    createdAt:  { type: Date, default: Date.now },
    updatedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);