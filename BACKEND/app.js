const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(helmet());
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Change to your frontend URL if needed
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', authRoutes); // Define your authentication routes


// SSL configuration
const options = {
  key: fs.readFileSync('./keys/privatekey.pem'),
  cert: fs.readFileSync('./keys/certificate.pem'),
};

//const PORT = process.env.PORT || 443; 
const PORT = process.env.PORT || 4000; // Change to 4000 for testing


console.log(`Server is running on https://localhost:${PORT}`);

const UserSchema = new mongoose.Schema({
  fullName: String,
  lastName: String,
  emailAddress: String,
  username: String,
  accountNumber: String,
  idNumber: String,
  password: String
});

// Create a model from the schema
const User = mongoose.model('User', UserSchema);

app.post('/api/register', async (req, res) => {
  const { fullName, lastName, emailAddress, username, accountNumber, idNumber, password } = req.body;

  // Create a new User instance
  const newUser = new User({
    fullName,
    lastName,
    emailAddress,
    username,
    accountNumber,
    idNumber,
    password
  });

  try {
    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
