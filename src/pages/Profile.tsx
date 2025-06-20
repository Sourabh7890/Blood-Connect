import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Droplet, Save } from 'lucide-react';
import BloodTypeSelector from '../components/BloodTypeSelector';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bloodType: user?.bloodType || '',
    phone: user?.phone || '',
    address: user?.location?.address || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBloodTypeChange = (bloodType: string) => {
    setFormData(prev => ({ ...prev, bloodType }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Prepare location data (in a real app, you would use geolocation or mapping API)
      const locationData = {
        address: formData.address,
        coordinates: [0, 0] // Placeholder coordinates
      };
      
      await updateUser({
        name: formData.name,
        bloodType: formData.bloodType,
        phone: formData.phone,
        location: locationData
      });
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setErrorMessage('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              <User className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
          
      
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <BloodTypeSelector 
                  value={formData.bloodType} 
                  onChange={handleBloodTypeChange} 
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  placeholder="Enter your full address"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Droplet className="h-4 w-4 mr-1 text-red-500" />
                  Blood Type
                </h3>
                <p className="text-gray-900">
                  {user?.bloodType || 'Not specified'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-500" />
                  Phone Number
                </h3>
                <p className="text-gray-900">
                  {user?.phone || 'Not specified'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  Address
                </h3>
                <p className="text-gray-900">
                  {user?.location?.address || 'Not specified'}
                </p>
              </div>
            </div>
            
          </div>
        )}
      </div>
      </div>
  );
};

export default Profile;