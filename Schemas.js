const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const DestinationSchema = new mongoose.Schema({
    id: String,
    title: { type: String, required: true },
    desc: String,
    img: String,
    weather: String,
    dining: String,
    season: String
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Destination: mongoose.model('Destination', DestinationSchema)
};