const express = require("express");
const { User } = require("../models/user.model");
const validator = require("validator");
const userRoute = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRoute.post("/register", async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required!', status: 400 });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address!', status: 400 });
        }

        email = email.toLowerCase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email address', status: 400 });
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            return res.status(400).json({ message: 'Password is not strong enough. It should be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol', status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword , role});
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user: user, status: 201 });

    } catch (err) {
        res.status(500).json({ error: err.message, status: 500 });
    }
});

userRoute.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required!', status: 400 });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email', status: 400 });
        }

        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: `User not found with this email: ${email}`, status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password', status: 400 });
        }

        const token = jwt.sign({ userId: user._id, userName: user.name }, process.env.SECRET || 'default_secret');
        res.status(200).json({ user: user, token: token, status: 200 });

    } catch (err) {
        res.status(500).json({ error: err.message, status: 500 });
    }
});

module.exports = { userRoute };
