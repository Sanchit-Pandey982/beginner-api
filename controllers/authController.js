require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER LOGIC
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation (Optional but recommended)
        if (!email || !password) return res.status(400).send("Email and Password required");

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send("User already exists");

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.json({ msg: "User registered successfully", id: user._id });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// 2. LOGIN LOGIC
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("User not found");

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid credentials");

        // Generate Token
        if (!process.env.JWT_SECRET) {
            return res.status(500).send("Server configuration error");
        }
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.json({ token, msg: "Logged in successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
};