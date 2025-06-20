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

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// Get all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    // Return users without passwords
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status (activate/deactivate)
router.put('/users/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const userIndex = users.findIndex(user => user._id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    users[userIndex].status = status;
    
    // Return updated user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system statistics
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    // Calculate stats
    const totalUsers = users.length;
    const donors = users.filter(user => user.role === 'donor').length;
    const recipients = users.filter(user => user.role === 'recipient').length;
    
    // In a real app, get more stats from database
    
    res.json({
      users: {
        total: totalUsers,
        donors,
        recipients
      },
      donations: {
        total: 42, // Mock data
        thisMonth: 12
      },
      requests: {
        active: 8,
        completed: 15,
        total: 23
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;