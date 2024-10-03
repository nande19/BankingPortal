const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Database setup (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost/paymentPortal', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const UserSchema = new mongoose.Schema({
    fullName: String,
    lastName: String,  // Added lastName field
    emailAddress: String,  // Added emailAddress field
    username: String,  // Added username field
    idNumber: String,
    accountNumber: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

// Register Route
app.post('/register', [
    check('fullName', 'Full Name is required')
        .notEmpty() 
        .matches(/^[a-zA-Z\s]+$/).withMessage('Full Name can only contain letters and spaces.'),
    check('lastName', 'Last Name is required')
        .notEmpty()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Last Name can only contain letters and spaces.'),
    check('emailAddress', 'Email Address is required').isEmail(),
    check('username', 'Username is required')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.'),
    check('idNumber', 'ID Number should be numeric')
        .isNumeric()
        .isLength({ min: 10, max: 10 }).withMessage('ID Number must be 10 digits long.'),
    check('accountNumber', 'Account Number should be numeric')
        .isNumeric()
        .isLength({ min: 10, max: 10 }).withMessage('Account Number must be 10 digits long.'),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullName, lastName, emailAddress, username, idNumber, accountNumber, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({ fullName, lastName, emailAddress, username, idNumber, accountNumber, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
});

// Login Route
app.post('/login', [
    check('username', 'Username is required')
        .notEmpty()
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.'),
    check('password', 'Password is required').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // JWT Token
    const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
    res.json({ token });
});
