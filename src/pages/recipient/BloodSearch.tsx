import { useState, useEffect } from 'react'
import { Search, MapPin, Phone, Clock, Filter, AlertCircle, UserPlus, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import BloodTypeSelector from '../../components/BloodTypeSelector'
import { supabase, type User } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

interface DonorWithDistance extends User {
  distance?: number
}

const BloodSearch = () => {
  const { user, isAuthenticated } = useAuth()
  const [bloodType, setBloodType] = useState('')
  const [donors, setDonors] = useState<DonorWithDistance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [onlyAvailable, setOnlyAvailable] = useState(true)
  const [maxDistance, setMaxDistance] = useState(50) // km

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const handleSearch = async () => {
    if (!bloodType) {
      toast.error('Please select a blood type')
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    
    try {
      // Build query for donors with matching blood type
      let query = supabase
        .from('users')
        .select('*')
        .eq('role', 'donor')
        .eq('blood_type', bloodType)

      // Filter by availability if requested
      if (onlyAvailable) {
        query = query.eq('status', 'active')
      }

      const { data, error } = await query

      if (error) throw error

      let results = data || []

      // Calculate distances if user has location
      if (user?.latitude && user?.longitude) {
        results = results
          .map(donor => {
            if (donor.latitude && donor.longitude) {
              const distance = calculateDistance(
                user.latitude!, 
                user.longitude!, 
                donor.latitude, 
                donor.longitude
              )
              return { ...donor, distance }
            }
            return donor
          })
          .filter(donor => !donor.distance || donor.distance <= maxDistance)
          .sort((a, b) => {
            if (a.distance && b.distance) return a.distance - b.distance
            if (a.distance) return -1
            if (b.distance) return 1
            return 0
          })
      }

      setDonors(results)
      
      if (results.length === 0) {
        toast.info('No donors found matching your criteria. Try expanding your search or registering more donors.')
      } else {
        toast.success(`Found ${results.length} donor${results.length !== 1 ? 's' : ''} matching your criteria`)
      }
    } catch (error: any) {
      console.error('Search error:', error)
      toast.error('Failed to search for donors. Please try again.')
      setDonors([])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Show authentication prompt if not logged in
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <Search className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Blood Donors</h1>
            <p className="text-lg text-gray-600 mb-8">
              To search for blood donors and access contact information, please log in or create an account.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition duration-200 flex items-center justify-center"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login to Search
            </Link>
            <Link
              to="/register"
              className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-md transition duration-200 flex items-center justify-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create Account
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Why create an account?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Access real donor contact information</li>
              <li>• Create blood requests for emergencies</li>
              <li>• Get notified about nearby donors</li>
              <li>• Help save lives in your community</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Show role prompt if user is not a recipient
  if (user?.role !== 'recipient') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <Search className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Blood Donor Search</h1>
            <p className="text-lg text-gray-600 mb-8">
              This feature is designed for recipients who need to find blood donors. 
              {user?.role === 'donor' ? ' As a donor, you can help by keeping your profile updated and available.' : ''}
            </p>
          </div>
          
          {user?.role === 'donor' ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                As a registered donor, you're already helping save lives! Recipients can find you through this search.
              </p>
              <Link
                to="/donor"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition duration-200 inline-flex items-center"
              >
                Go to Donor Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">
                To search for blood donors, you need to register as a recipient.
              </p>
              <Link
                to="/register"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition duration-200 inline-flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Register as Recipient
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Find Blood Donors</h1>
        <p className="text-gray-600 mb-6">
          Search for registered blood donors based on blood type. All results show real donor data from our database.
        </p>
        
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Real Data Search</h3>
              <p className="text-sm text-blue-700 mt-1">
                This search shows actual registered donors from our database. If no results appear, it means no donors with the selected blood type have registered yet.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type *
            </label>
            <BloodTypeSelector value={bloodType} onChange={setBloodType} />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search Real Donors
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleFilters}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {hasSearched && donors.length > 0 && (
            <p className="text-sm text-gray-600">
              Showing {donors.length} real donor{donors.length !== 1 ? 's' : ''} from database
            </p>
          )}
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  id="available"
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="available" className="ml-2 text-sm text-gray-700">
                  Show only available donors
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Distance: {maxDistance} km
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
        
        {hasSearched && (
          <>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : donors.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Real Registered Donors ({donors.length} found)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {donors.map((donor) => (
                    <div key={donor.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                      <div className="flex justify-between mb-2">
                        <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                          {donor.blood_type}
                        </span>
                        {donor.distance && (
                          <span className="text-sm text-gray-500">
                            {donor.distance.toFixed(1)} km away
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-lg mb-2">{donor.name}</h3>
                      
                      <div className="space-y-2 mb-4">
                        {donor.address && (
                          <div className="flex items-start text-sm">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                            <span className="text-gray-700">{donor.address}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">
                            Last donated: {donor.last_donation ? new Date(donor.last_donation).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                        {donor.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-700">{donor.phone}</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Registered: {new Date(donor.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${donor.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                          {donor.status === 'active' ? 'Available to donate' : 'Currently unavailable'}
                        </span>
                        {donor.phone && (
                          <a
                            href={`tel:${donor.phone.replace(/[^\d]/g, '')}`}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                          >
                            Call Now
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Donors Found</h3>
                <p className="text-gray-600 mb-4">
                  No registered donors found with blood type <strong>{bloodType}</strong> in our database.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Try searching for a different blood type</p>
                  <p>• Encourage more people to register as donors</p>
                  <p>• Check back later as new donors register daily</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Registration Encouragement */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Help Grow Our Donor Network</h3>
        <p className="text-red-700 mb-4">
          The more donors we have registered, the better we can serve emergency blood needs. 
          Share this platform with potential donors in your community.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/register"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-center transition duration-200"
          >
            Register as Donor
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'BloodConnect - Save Lives',
                  text: 'Join our blood donor network and help save lives in emergencies',
                  url: window.location.origin
                })
              } else {
                navigator.clipboard.writeText(window.location.origin)
                toast.success('Website link copied to clipboard!')
              }
            }}
            className="bg-white border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md text-center transition duration-200"
          >
            Share Platform
          </button>
        </div>
      </div>
    </div>
  )
}

export default BloodSearch