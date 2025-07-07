const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    country: String,
    founded: Number,
    stadium: String
},{ collection: 'team' });

module.exports = mongoose.model('Team', teamSchema, 'team');
