import { useState } from 'react';
import { Shield, Users, Activity, AlertTriangle, Filter, Search, Trash, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Mock users data
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'donor', status: 'active', bloodType: 'O+', joined: '2023-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'recipient', status: 'active', joined: '2023-02-20' },
    { id: '3', name: 'Michael Johnson', email: 'michael@example.com', role: 'donor', status: 'inactive', bloodType: 'A-', joined: '2023-03-10' },
    { id: '4', name: 'Emily Williams', email: 'emily@example.com', role: 'recipient', status: 'pending', joined: '2023-04-05' },
    { id: '5', name: 'David Brown', email: 'david@example.com', role: 'donor', status: 'active', bloodType: 'B+', joined: '2023-05-12' },
  ];
  
  // Mock reports data
  const reports = [
    { id: '1', type: 'Emergency', title: 'Urgent O- needed', location: 'City Hospital', status: 'active', date: '2023-10-25' },
    { id: '2', type: 'Regular', title: 'Blood Drive Event', location: 'Community Center', status: 'upcoming', date: '2023-11-10' },
    { id: '3', type: 'Emergency', title: 'AB+ needed for surgery', location: 'Medical Center', status: 'resolved', date: '2023-10-15' },
  ];
  
  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-red-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Total Users</h2>
            </div>
            <div className="text-3xl font-bold text-blue-600">248</div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-600">Donors: 156</span>
              <span className="text-gray-600">Recipients: 92</span>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 border border-green-100">
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Active Donations</h2>
            </div>
            <div className="text-3xl font-bold text-green-600">42</div>
            <div className="mt-2 text-sm text-gray-600">
              Last 30 days: +12 donations
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-6 border border-red-100">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Emergency Requests</h2>
            </div>
            <div className="text-3xl font-bold text-red-600">8</div>
            <div className="mt-2 text-sm text-gray-600">
              Open: 3 | Resolved: 5
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-6">
            <button
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'reports'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              Blood Requests
            </button>
            <button
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'settings'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative mb-4 md:mb-0 md:w-1/3">
              <input
                type="text"
                placeholder={`Search ${activeTab === 'users' ? 'users' : 'requests'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <Filter className="h-5 w-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {showFilters && activeTab === 'users' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="donor">Donor</option>
                    <option value="recipient">Recipient</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'donor' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.bloodType || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(user.joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        {user.status === 'active' ? (
                          <button className="text-gray-600 hover:text-gray-900">Deactivate</button>
                        ) : (
                          <button className="text-green-600 hover:text-green-900">Activate</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found matching your filters.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Reports Tab Content */}
        {activeTab === 'reports' && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.type === 'Emergency' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        {report.status === 'active' ? (
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        ) : report.status === 'upcoming' ? (
                          <button className="text-gray-600 hover:text-gray-900 mr-3">
                            <XCircle className="h-5 w-5" />
                          </button>
                        ) : null}
                        <button className="text-red-600 hover:text-red-900">
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
                Add New Blood Request
              </button>
            </div>
          </div>
        )}
        
        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Alert Radius
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        defaultValue={25}
                        className="w-20 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span className="ml-2 text-gray-600">km</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Maximum distance for emergency blood request notifications
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Donation Cooldown Period
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        defaultValue={90}
                        className="w-20 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span className="ml-2 text-gray-600">days</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Minimum days between blood donations for donors
                    </p>
                  </div>
                  
                  <div className="flex items-center pt-2">
                    <input
                      id="auto-approve"
                      type="checkbox"
                      defaultChecked={false}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="auto-approve" className="ml-2 text-sm text-gray-700">
                      Auto-approve new user registrations
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                    Save Settings
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="notify-emergency"
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="notify-emergency" className="ml-2 text-sm text-gray-700">
                      Emergency blood requests
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="notify-new-user"
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="notify-new-user" className="ml-2 text-sm text-gray-700">
                      New user registrations
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="notify-reports"
                      type="checkbox"
                      defaultChecked={false}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="notify-reports" className="ml-2 text-sm text-gray-700">
                      Weekly donation reports
                    </label>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mt-8 mb-4">Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timeout
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        defaultValue={60}
                        className="w-20 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span className="ml-2 text-gray-600">minutes</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                      Reset Admin Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;