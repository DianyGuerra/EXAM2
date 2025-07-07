const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
        required: true
    },
    age: Number,
    nationality: String,
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    }
},{collection: 'player'});

module.exports = mongoose.model('Player', playerSchema, 'player');
