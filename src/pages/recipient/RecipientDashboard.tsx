import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Clock, Bell, Phone, MapPin, Users } from 'lucide-react';

const RecipientDashboard = () => {
  const { user } = useAuth();
  
  // Mock data for recent requests
  const recentRequests = [
    { id: '1', bloodType: 'O+', date: '2023-10-15', status: 'active', responses: 3 },
    { id: '2', bloodType: 'AB-', date: '2023-09-28', status: 'completed', responses: 2 },
    { id: '3', bloodType: 'B+', date: '2023-08-10', status: 'expired', responses: 1 },
  ];
  
  // Mock data for nearby donors
  const nearbyDonors = [
    { id: '1', bloodType: 'O+', distance: '1.2 km', lastDonated: '3 months ago' },
    { id: '2', bloodType: 'A+', distance: '2.5 km', lastDonated: '5 months ago' },
    { id: '3', bloodType: 'B-', distance: '3.8 km', lastDonated: '2 months ago' },
  ];

  
};

export default RecipientDashboard;