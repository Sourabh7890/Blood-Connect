import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Droplet, UserPlus, Heart, Search, Eye, EyeOff } from 'lucide-react'
import BloodTypeSelector from '../../components/BloodTypeSelector'
import toast from 'react-hot-toast'
import { validateEmail, validatePhone, validatePassword, validateName, formatPhoneNumber } from '../../utils/validation'

const Register = () => {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'donor' | 'recipient' | ''>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    phone: '',
    address: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelect = (selectedRole: 'donor' | 'recipient') => {
    setRole(selectedRole)
    setStep(2)
  }

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
    setFormData(prev => ({ ...prev, bloodType }))
    if (errors.bloodType) {
      setErrors(prev => ({ ...prev, bloodType: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters and contain only letters'
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., user@example.com)'
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = `Password must contain: ${passwordValidation.errors.join(', ')}`
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits'
    }

    // Blood type validation for donors
    if (role === 'donor' && !formData.bloodType) {
      newErrors.bloodType = 'Blood type is required for donors'
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getCurrentLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.warn('Geolocation error:', error)
          // Provide default coordinates if geolocation fails
          resolve({ latitude: 0, longitude: 0 })
        }
      )
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Get user's location
      const location = await getCurrentLocation()
      
      await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role,
        bloodType: formData.bloodType || undefined,
        phone: formData.phone.replace(/\D/g, ''), // Store only digits
        address: formData.address.trim(),
        latitude: location.latitude,
        longitude: location.longitude
      })
      
      toast.success('Registration successful! Welcome to BloodConnect!')
      // Navigate immediately after success
      navigate(role === 'donor' ? '/donor' : '/recipient')
    } catch (err: any) {
      // Error is handled in the register function
    } finally {
      setIsLoading(false)
    }
  }

  const renderRoleSelection = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Join BloodConnect as a</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => handleRoleSelect('donor')}
          className="bg-white border-2 border-gray-200 hover:border-red-500 rounded-lg p-6 text-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105"
        >
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Blood Donor</h3>
          <p className="text-gray-600">
            I want to donate blood and help save lives
          </p>
        </button>
        
        <button
          onClick={() => handleRoleSelect('recipient')}
          className="bg-white border-2 border-gray-200 hover:border-red-500 rounded-lg p-6 text-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105"
        >
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Blood Recipient</h3>
          <p className="text-gray-600">
            I need to find blood donors for emergency
          </p>
        </button>
      </div>
    </div>
  )

  const renderRegistrationForm = () => (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Register as a {role === 'donor' ? 'Blood Donor' : 'Recipient'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
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
              placeholder="Enter your full name"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="user@example.com"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="bloodType" className="block text-gray-700 text-sm font-medium mb-2">
              Blood Type {role === 'donor' ? '*' : ''}
            </label>
            <BloodTypeSelector 
              value={formData.bloodType} 
              onChange={handleBloodTypeChange} 
            />
            {errors.bloodType && <p className="text-red-500 text-xs mt-1">{errors.bloodType}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
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
        </div>
        
        <div className="mb-6">
          <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">
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
            placeholder="Enter your full address"
            required
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-red-600 hover:text-red-500 transition duration-200"
          >
            ← Back to role selection
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )

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
  )
}

export default Register