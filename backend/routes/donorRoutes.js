import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock donations database (in memory for testing)
let donations = [];

// Middleware to authenticate token
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, 'secret_jwt_key'); // In real app, use environment variable
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is a donor
const isDonor = (req, res, next) => {
  if (req.user.role !== 'donor') {
    return res.status(403).json({ message: 'Access denied. Donor role required.' });
  }
  next();
};

// Get donor profile with donation history
router.get('/profile', auth, isDonor, async (req, res) => {
  try {
    // In a real app, fetch donor data from database
    const donorDonations = donations.filter(donation => donation.donorId === req.user.id);
    
    res.json({
      donations: donorDonations,
      donationCount: donorDonations.length
    });
  } catch (error) {
    console.error('Get donor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donor availability
router.put('/availability', auth, isDonor, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    // In a real app, update donor availability in database
    
    res.json({
      isAvailable,
      message: `Availability updated to ${isAvailable ? 'available' : 'unavailable'}`
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new donation record
router.post('/donations', auth, isDonor, async (req, res) => {
  try {
    const { date, location, bloodAmount } = req.body;
    
    const newDonation = {
      id: Date.now().toString(),
      donorId: req.user.id,
      date,
      location,
      bloodAmount,
      status: 'completed',
      createdAt: new Date()
    };
    
    donations.push(newDonation);
    
    res.status(201).json(newDonation);
  } catch (error) {
    console.error('Add donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;