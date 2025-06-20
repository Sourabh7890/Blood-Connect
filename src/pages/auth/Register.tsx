import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplet, UserPlus, Heart, Search } from 'lucide-react';
import BloodTypeSelector from '../../components/BloodTypeSelector';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'donor' | 'recipient' | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole: 'donor' | 'recipient') => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBloodTypeChange = (bloodType: string) => {
    setFormData(prev => ({ ...prev, bloodType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError('Name should only contain alphabets and spaces');
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare location data (in a real app, you would use geolocation or mapping API)
      const locationData = {
        address: formData.address,
        coordinates: [0, 0] // Placeholder coordinates
      };
      
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        bloodType: formData.bloodType,
        phone: formData.phone,
        location: locationData
      });
      
      navigate(role === 'donor' ? '/donor' : '/recipient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Join BloodConnect as a</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => handleRoleSelect('donor')}
          className="bg-white border-2 border-gray-200 hover:border-red-500 rounded-lg p-6 text-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Blood Donor</h3>
          
        </button>
        
        <button
          onClick={() => handleRoleSelect('recipient')}
          className="bg-white border-2 border-gray-200 hover:border-red-500 rounded-lg p-6 text-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Blood Recipient</h3>
          
        </button>
      </div>
    </div>
  );

  const renderRegistrationForm = () => (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Register as a {role === 'donor' ? 'Blood Donor' : 'Recipient'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
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
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="bloodType" className="block text-gray-700 text-sm font-medium mb-2">Blood Type</label>
            <BloodTypeSelector 
              value={formData.bloodType} 
              onChange={handleBloodTypeChange} 
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
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
        </div>
        
        <div className="mb-6">
          <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">Address</label>
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
        
        <div className="flex justify-center items-center mb-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>
    </>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <div className="flex justify-center mb-8">
          <Droplet className="h-12 w-12 text-red-600" />
        </div>
        
        {step === 1 ? renderRoleSelection() : renderRegistrationForm()}
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:text-red-500 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
