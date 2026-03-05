const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    currentMood: {
        name: String,
        setAt: Date
    }
});

module.exports = mongoose.model('User', userSchema);