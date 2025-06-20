import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock users database (in memory for testing)
let users = [];

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

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = users.find(user => user._id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user info without password
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userIndex = users.findIndex(user => user._id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    const { name, bloodType, phone, location } = req.body;
    
    if (name) users[userIndex].name = name;
    if (bloodType) users[userIndex].bloodType = bloodType;
    if (phone) users[userIndex].phone = phone;
    if (location) users[userIndex].location = location;
    
    // Return updated user info without password
    const { password, ...userWithoutPassword } = users[userIndex];
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;