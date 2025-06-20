import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, Calendar, Clock, CheckCircle, XCircle, User } from 'lucide-react';

interface DonationRecord {
  id: string;
  date: string;
  location: string;
  status: 'available' | 'unavailable';
}

const DonorDashboard = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<'available' | 'unavailable'>('available');
  const [lastDonation, setLastDonation] = useState<string | null>(null);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);

  // Mock data - in a real app, this would come from the API
  useEffect(() => {
    // Mock last donation date
    setLastDonation('2023-09-15');
    
    // Mock donation records
    setDonationRecords([
      { id: '1', date: '2023-09-15', location: 'City Hospital', status: 'available' },
      { id: '2', date: '2023-06-20', location: 'Medical Center', status: 'available' },
      { id: '3', date: '2023-03-05', location: 'Blood Bank', status: 'available' },
    ]);
  }, []);

  const toggleAvailability = () => {
    setAvailability(prev => prev === 'available' ? 'unavailable' : 'available');
  };

  const canDonateAgain = () => {
    if (!lastDonation) return true;
    
    const lastDonationDate = new Date(lastDonation);
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    return lastDonationDate <= threeMonthsAgo;
  };

  const nextDonationDate = () => {
    if (!lastDonation) return 'Now';
    
    const lastDonationDate = new Date(lastDonation);
    const nextDate = new Date(lastDonationDate);
    nextDate.setMonth(nextDate.getMonth() + 3);
    
    return nextDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Donor Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Donor Profile Card */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600">Donor</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Blood Type:</span>
                <span className="font-semibold">{user?.bloodType || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-semibold">{user?.phone || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold">{user?.location?.address || 'Not specified'}</span>
              </div>
            </div>
          </div>
          
         
          
         
        </div>
      </div>
      
    
      
   
    </div>
  );
};

export default DonorDashboard;