import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, type Donation, type BloodRequest } from '../../lib/supabase'
import { Heart, Calendar, Clock, CheckCircle, XCircle, User, Plus, Bell, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const DonorDashboard = () => {
  const { user, updateUser } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDonation, setShowAddDonation] = useState(false)
  const [newDonation, setNewDonation] = useState({
    date: '',
    location: '',
    blood_amount: 450
  })

  useEffect(() => {
    if (user) {
      fetchDonations()
      fetchBloodRequests()
    }
  }, [user])

  const fetchDonations = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setDonations(data || [])
    } catch (error: any) {
      console.error('Error fetching donations:', error)
      toast.error('Failed to load donation history')
    }
  }

  const fetchBloodRequests = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*, recipient:users!blood_requests_recipient_id_fkey(*)')
        .eq('blood_type', user.blood_type)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setBloodRequests(data || [])
    } catch (error: any) {
      console.error('Error fetching blood requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAvailability = async () => {
    if (!user) return

    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    
    try {
      await updateUser({ status: newStatus })
      toast.success(`Status updated to ${newStatus === 'active' ? 'available' : 'unavailable'}`)
    } catch (error) {
      // Error is handled in updateUser
    }
  }

  const addDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('donations')
        .insert([
          {
            donor_id: user.id,
            date: newDonation.date,
            location: newDonation.location,
            blood_amount: newDonation.blood_amount,
            status: 'completed'
          }
        ])

      if (error) throw error

      // Update user's last donation and donation count
      await updateUser({
        last_donation: newDonation.date,
        donation_count: user.donation_count + 1
      })

      setNewDonation({ date: '', location: '', blood_amount: 450 })
      setShowAddDonation(false)
      fetchDonations()
      toast.success('Donation record added successfully!')
    } catch (error: any) {
      console.error('Error adding donation:', error)
      toast.error('Failed to add donation record')
    }
  }

  const canDonateAgain = () => {
    if (!user?.last_donation) return true
    
    const lastDonationDate = new Date(user.last_donation)
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    
    return lastDonationDate <= threeMonthsAgo
  }

  const nextDonationDate = () => {
    if (!user?.last_donation) return 'Now'
    
    const lastDonationDate = new Date(user.last_donation)
    const nextDate = new Date(lastDonationDate)
    nextDate.setMonth(nextDate.getMonth() + 3)
    
    return nextDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
                <p className="text-gray-600">Registered Donor</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Blood Type:</span>
                <span className="font-semibold">{user?.blood_type || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-semibold">{user?.phone || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold">{user?.address || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-semibold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Availability Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 text-red-600 mr-2" />
              Donation Availability
            </h2>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 mb-1">Your status:</p>
                {user?.status === 'active' ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Available to donate</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-600">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Not available</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={toggleAvailability}
                className={`px-4 py-2 rounded-md transition duration-200 ${
                  user?.status === 'active'
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                {user?.status === 'active' ? 'Set Unavailable' : 'Set Available'}
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">Last donation:</span>
                </div>
                <span className="font-medium">
                  {user?.last_donation ? new Date(user.last_donation).toLocaleDateString() : 'No record'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">Next eligible date:</span>
                </div>
                <span className={`font-medium ${canDonateAgain() ? 'text-green-600' : ''}`}>
                  {nextDonationDate()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h2 className="text-lg font-semibold mb-4">Your Impact</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{user?.donation_count || 0}</div>
                <p className="text-gray-600">Total Donations</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{(user?.donation_count || 0) * 3}</div>
                <p className="text-gray-600">Lives Potentially Saved</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-center text-gray-600 text-sm">
                  One donation can save up to 3 lives. Keep donating to make a difference!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Blood Requests */}
      {bloodRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bell className="h-5 w-5 text-red-600 mr-2" />
            Active Blood Requests for {user?.blood_type}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bloodRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-200 transition duration-200">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    request.urgency === 'emergency' 
                      ? 'bg-red-100 text-red-800' 
                      : request.urgency === 'urgent'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {request.urgency.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="font-medium mb-2">Patient: {request.patient_name}</h3>
                <p className="text-sm text-gray-600 mb-2">Hospital: {request.hospital}</p>
                
                {request.details && (
                  <p className="text-sm text-gray-700 mb-3">{request.details}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Blood Type: <span className="font-medium text-red-600">{request.blood_type}</span>
                  </span>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200">
                    Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Donation History */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Donation History</h2>
          <button
            onClick={() => setShowAddDonation(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Donation
          </button>
        </div>
        
        {showAddDonation && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-4">Add New Donation Record</h3>
            <form onSubmit={addDonation} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newDonation.date}
                  onChange={(e) => setNewDonation({ ...newDonation, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newDonation.location}
                  onChange={(e) => setNewDonation({ ...newDonation, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Hospital/Blood Bank name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ml)</label>
                <input
                  type="number"
                  value={newDonation.blood_amount}
                  onChange={(e) => setNewDonation({ ...newDonation, blood_amount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="100"
                  max="500"
                  required
                />
              </div>
              <div className="md:col-span-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDonation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Add Donation
                </button>
              </div>
            </form>
          </div>
        )}
        
        {donations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(donation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{donation.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{donation.blood_amount} ml</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {donation.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No donation records found.</p>
            <p className="text-sm text-gray-400">Add your first donation record to track your impact!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DonorDashboard