const express = require('express')
const { UserModel } = require('../models/user.model')
const validator = require('validator')
const userRouter = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


userRouter.post('/register', async (req, res) => {
    try {
    const { name, email, password } = req.body

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address!', status: 400 });
        }
        email = email.toLowerCase();
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email address' });
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            return res.status(400).json({ message: 'Password is not enough strong. it should be at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 symbol', status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user: user, status: 201 });

    } catch (err) {
        res.status(500).json({ error: err })
    }
})

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        email = email.toLowerCase();

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: `User not found with this email: ${email}`, status: 400 });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password', status: 400 });
        }

        const token = jwt.sign({ userId: user._id, username: user.name }, process.env.SECRET);

        res.json({user:user, token:token, status:200});

    } catch (err) {
        res.status(500).json({ 'err': err.message })
    }
})

module.exports = { userRouter }