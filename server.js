// Updated line to find the renamed config file
require('dotenv').config({ path: './config.env' }); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Destination } = require('./models/Schemas');
const { logger, protect } = require('./middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("Connection Error:", err));

// --- API ENDPOINTS ---

// 1. POST: Register (Auth Entity)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.json({ token, user: { username, email } });
    } catch (err) {
        res.status(400).json({ error: "Registration failed" });
    }
});

// 2. GET: Retrieve Destinations (Read Operation)
app.get('/api/destinations', async (req, res) => {
    const list = await Destination.find();
    res.json(list);
});

// 3. POST: Add New Destination (Create Operation - Protected)
app.post('/api/destinations', protect, async (req, res) => {
    const entry = new Destination(req.body);
    await entry.save();
    res.status(201).json(entry);
});

// 4. DELETE: Remove Destination (Delete Operation - Protected)
app.delete('/api/destinations/:id', protect, async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from database" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));