const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validEnum = require('../middleware/validEnum'); 

const userTypes = ['customer', 'admin', 'supplier'];


// User registration
router.post('/register', async (req, res) => {
    try {
    const { email, password, type, firstName, lastName, streetAddress, city } = req.body;
    if (!email || !password || !type || !firstName || !lastName || !streetAddress || !city) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!validEnum('type', userTypes)(req, res)) return;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        email: email,
        password: hashedPassword,
        type: type,
        firstName: firstName,
        lastName: lastName,
        streetAddress: streetAddress,
        city: city
      });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
    }
    });

   
   // User login
    router.post('/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
    }


    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id, type: user.type }, 'your-secret-key', {
    expiresIn: '3h',
    });
    res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }
    });
   
   module.exports = router;