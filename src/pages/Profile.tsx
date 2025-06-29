import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Phone, MapPin, Droplet, Save } from 'lucide-react'
import BloodTypeSelector from '../components/BloodTypeSelector'
import { validateEmail, validatePhone, validateName, formatPhoneNumber } from '../utils/validation'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    blood_type: user?.blood_type || '',
    phone: user?.phone ? formatPhoneNumber(user.phone) : '',
    address: user?.address || '',
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format phone number as user types
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value)
      setFormData(prev => ({ ...prev, [name]: formattedPhone }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const handleBloodTypeChange = (bloodType: string) => {
    setFormData(prev => ({ ...prev, blood_type: bloodType }))
    if (errors.blood_type) {
      setErrors(prev => ({ ...prev, blood_type: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!validateName(formData.name)) {
      newErrors.name = 'Invalid name'
    }

    // Phone validation (if provided)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      await updateUser({
        name: formData.name.trim(),
        blood_type: formData.blood_type || undefined,
        phone: formData.phone.replace(/\D/g, ''), // Store only digits
        address: formData.address.trim()
      })
      
      setIsEditing(false)
    } catch (err) {
      // Error is handled in updateUser
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      blood_type: user?.blood_type || '',
      phone: user?.phone ? formatPhoneNumber(user.phone) : '',
      address: user?.address || '',
    })
    setErrors({})
    setIsEditing(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              <User className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <BloodTypeSelector 
                  value={formData.blood_type} 
                  onChange={handleBloodTypeChange} 
                />
                {errors.blood_type && <p className="text-red-500 text-xs mt-1">{errors.blood_type}</p>}
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(123) 456-7890"
                  maxLength={14}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  placeholder="Enter your full address"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
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
                  {user?.blood_type || 'Not specified'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-500" />
                  Phone Number
                </h3>
                <p className="text-gray-900">
                  {user?.phone ? formatPhoneNumber(user.phone) : 'Not specified'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  Address
                </h3>
                <p className="text-gray-900">
                  {user?.address || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="font-medium text-red-800 mb-2">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700">Member Since:</span>
                  <span className="text-red-800 font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Account Status:</span>
                  <span className={`font-medium ${
                    user?.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {user?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {user?.role === 'donor' && (
                  <div className="flex justify-between">
                    <span className="text-red-700">Total Donations:</span>
                    <span className="text-red-800 font-medium">{user?.donation_count || 0}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {user?.role === 'donor' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Donation Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="available-weekends"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="available-weekends" className="ml-2 text-gray-700">
                Available on weekends
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="emergency-only"
                type="checkbox"
                defaultChecked={false}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="emergency-only" className="ml-2 text-gray-700">
                Contact for emergencies only
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="receive-notifications"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="receive-notifications" className="ml-2 text-gray-700">
                Receive blood drive notifications
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200">
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile