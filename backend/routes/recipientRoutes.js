import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock blood requests database (in memory for testing)
let bloodRequests = [];

// ... donors array here (unchanged) ...

// Middleware to authenticate token
const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.replace('Bearer ', '');

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

// Middleware to check if user is a recipient
const isRecipient = (req, res, next) => {
    if (req.user.role !== 'recipient' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Recipient role required.' });
    }
    next();
};

// Search for donors
router.get('/search', auth, isRecipient, async(req, res) => {
    try {
        const { bloodType, location } = req.query;

        let filteredDonors = [...donors];

        if (bloodType) {
            filteredDonors = filteredDonors.filter(donor => donor.bloodType === bloodType);
        }

        if (location && location.trim()) {
            const loc = location.trim().toLowerCase();
            filteredDonors = filteredDonors.filter(donor =>
                donor.location.address.toLowerCase().includes(loc)
            );
        }

        filteredDonors = filteredDonors.filter(donor => donor.isAvailable);

        const donorData = filteredDonors.map(donor => ({
            id: donor.id,
            name: donor.name,
            bloodType: donor.bloodType,
            location: donor.location.address,
            phone: donor.phone,
            lastDonated: donor.lastDonated
        }));

        res.json(donorData);
    } catch (error) {
        console.error('Search donors error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ... rest of your routes (unchanged) ...

export default router;