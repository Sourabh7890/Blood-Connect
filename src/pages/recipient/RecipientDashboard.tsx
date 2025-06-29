import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase, type BloodRequest, type User } from '../../lib/supabase'
import { Search, Clock, Bell, Phone, MapPin, Users, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const RecipientDashboard = () => {
  const { user } = useAuth()
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([])
  const [nearbyDonors, setNearbyDonors] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateRequest, setShowCreateRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    blood_type: '',
    urgency: 'normal' as 'normal' | 'urgent' | 'emergency',
    patient_name: '',
    hospital: '',
    details: ''
  })

  useEffect(() => {
    if (user) {
      fetchBloodRequests()
      fetchNearbyDonors()
    }
  }, [user])

  const fetchBloodRequests = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBloodRequests(data || [])
    } catch (error: any) {
      console.error('Error fetching blood requests:', error)
      toast.error('Failed to load blood requests')
    }
  }

  const fetchNearbyDonors = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'donor')
        .eq('status', 'active')
        .limit(5)

      if (error) throw error
      setNearbyDonors(data || [])
    } catch (error: any) {
      console.error('Error fetching nearby donors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createBloodRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('blood_requests')
        .insert([
          {
            recipient_id: user.id,
            blood_type: newRequest.blood_type,
            urgency: newRequest.urgency,
            patient_name: newRequest.patient_name,
            hospital: newRequest.hospital,
            details: newRequest.details,
            status: 'active'
          }
        ])

      if (error) throw error

      setNewRequest({
        blood_type: '',
        urgency: 'normal',
        patient_name: '',
        hospital: '',
        details: ''
      })
      setShowCreateRequest(false)
      fetchBloodRequests()
      toast.success('Blood request created successfully!')
    } catch (error: any) {
      console.error('Error creating blood request:', error)
      toast.error('Failed to create blood request')
    }
  }

  const closeBloodRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'completed' })
        .eq('id', requestId)

      if (error) throw error

      fetchBloodRequests()
      toast.success('Blood request closed successfully!')
    } catch (error: any) {
      console.error('Error closing blood request:', error)
      toast.error('Failed to close blood request')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Recipient Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Find blood donors in your area and manage your blood requests.
        </p>
        
        {/* Emergency Search Button */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Emergency Blood Need?</h2>
              <p className="text-gray-700">
                Find donors near you immediately with our emergency search.
              </p>
            </div>
            <Link 
              to="/search" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition duration-200 flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Blood Now
            </Link>
          </div>
        </div>
        
        {/* Blood Requests */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Blood Requests</h2>
          <button
            onClick={() => setShowCreateRequest(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </button>
        </div>

        {showCreateRequest && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-4">Create New Blood Request</h3>
            <form onSubmit={createBloodRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <select
                    value={newRequest.blood_type}
                    onChange={(e) => setNewRequest({ ...newRequest, blood_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Blood Type</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={newRequest.patient_name}
                    onChange={(e) => setNewRequest({ ...newRequest, patient_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                  <input
                    type="text"
                    value={newRequest.hospital}
                    onChange={(e) => setNewRequest({ ...newRequest, hospital: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                <textarea
                  value={newRequest.details}
                  onChange={(e) => setNewRequest({ ...newRequest, details: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Any additional information about the request..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRequest(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        )}
        
        {bloodRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bloodRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                        {request.blood_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.patient_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.urgency === 'emergency' 
                          ? 'bg-red-100 text-red-800' 
                          : request.urgency === 'urgent'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.status === 'active' && (
                        <button 
                          onClick={() => closeBloodRequest(request.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">You haven't made any blood requests yet.</p>
            <button 
              onClick={() => setShowCreateRequest(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Create Your First Request
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Nearby Donors */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin className="h-5 w-5 text-red-600 mr-2" />
            Available Donors
          </h2>
          
          <div className="space-y-4">
            {nearbyDonors.slice(0, 3).map((donor) => (
              <div key={donor.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-200 transition duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                    {donor.blood_type}
                  </span>
                  <span className="text-sm text-gray-500">{donor.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Last donated: {donor.last_donation ? new Date(donor.last_donation).toLocaleDateString() : 'Never'}
                  </span>
                  {donor.phone && (
                    <a 
                      href={`tel:${donor.phone}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Contact
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/search" 
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              View All Donors
            </Link>
          </div>
        </div>
        
        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Phone className="h-5 w-5 text-red-600 mr-2" />
            Emergency Contacts
          </h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">City Hospital Blood Bank</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">(123) 456-7890</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">123 Hospital St, City</span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Red Cross Blood Services</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">(987) 654-3210</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">456 Health Ave, Town</span>
                </div>
              </div>
            </div>
            
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h3 className="font-medium mb-3 text-red-800">Emergency Medical Services</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm font-semibold text-red-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>911</span>
                </div>
                <p className="text-xs text-gray-600">For life-threatening emergencies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipientDashboard