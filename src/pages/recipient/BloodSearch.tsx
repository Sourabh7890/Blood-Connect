import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, Filter } from 'lucide-react';
import BloodTypeSelector from '../../components/BloodTypeSelector';

interface Donor {
  id: string;
  name: string;
  bloodType: string;
  distance: number;
  lastDonated: string;
  phone: string;
  location: string;
  available: boolean;
}

const BloodSearch = () => {
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState<number>(10);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  // Mock data for donors - in a real app, this would come from an API
  useEffect(() => {
    const mockDonors: Donor[] = [
      {
        id: '1',
        name: 'atharva yemul',
        bloodType: 'A+',
        distance: 2.3,
        lastDonated: '2024-05-10',
        phone: '9322245401',
        location: 'Pimpri, Pune',
        available: true
      },
      {
        id: '2',
        name: 'kartik phad',
        bloodType: 'A-',
        distance: 3.5,
        lastDonated: '2024-04-22',
        phone: '9765234567',
        location: 'Kothrud, Pune',
        available: true
      },
      {
        id: '3',
        name: 'darshan jadhav',
        bloodType: 'B+',
        distance: 1.8,
        lastDonated: '2024-03-15',
        phone: '9890123456',
        location: 'Hadapsar, Pune',
        available: true
      },
      {
        id: '4',
        name: 'tushar sawale',
        bloodType: 'B-',
        distance: 4.2,
        lastDonated: '2024-06-01',
        phone: '9922345678',
        location: 'Baner, Pune',
        available: true
      },
      {
        id: '5',
        name: 'sudhip thange',
        bloodType: 'AB+',
        distance: 0.7,
        lastDonated: '2024-05-28',
        phone: '9845678901',
        location: 'alandi, Pune',
        available: true
      },
      {
        id: '6',
        name: 'sovil ingle',
        bloodType: 'AB-',
        distance: 5.1,
        lastDonated: '2024-04-30',
        phone: '9733890123',
        location: 'Wakad, Pune',
        available: true
      },
      {
        id: '7',
        name: 'aryan moon',
        bloodType: 'O+',
        distance: 2.9,
        lastDonated: '2024-05-12',
        phone: '9876543210',
        location: 'Viman Nagar, Pune',
        available: true
      },
      {
        id: '8',
        name: 'manas kokate',
        bloodType: 'O-',
        distance: 3.7,
        lastDonated: '2024-05-18',
        phone: '9123456789',
        location: 'Aundh, Pune',
        available: true
      },
      // {
      //   id: '9',
      //   name: 'Rohit Patil',
      //   bloodType: 'O+',
      //   distance: 1.2,
      //   lastDonated: '2024-06-02',
      //   phone: '9001234567',
      //   location: 'Swargate, Pune',
      //   available: true
      // },
      // {
      //   id: '10',
      //   name: 'Kavita More',
      //   bloodType: 'A+',
      //   distance: 2.5,
      //   lastDonated: '2024-05-25',
      //   phone: '9012345678',
      //   location: 'Katraj, Pune',
      //   available: true
      // },
      // {
      //   id: '11',
      //   name: 'Rajesh Gupta',
      //   bloodType: 'B+',
      //   distance: 6.3,
      //   lastDonated: '2024-05-15',
      //   phone: '9988776655',
      //   location: 'Kharadi, Pune',
      //   available: true
      // },
      // {
      //   id: '12',
      //   name: 'Sunita Shetty',
      //   bloodType: 'O-',
      //   distance: 7.1,
      //   lastDonated: '2024-04-28',
      //   phone: '9876501234',
      //   location: 'Kondhwa, Pune',
      //   available: false
      // },
      // {
      //   id: '13',
      //   name: 'Vivek Nair',
      //   bloodType: 'A-',
      //   distance: 5.8,
      //   lastDonated: '2024-05-20',
      //   phone: '9765432109',
      //   location: 'Pashan, Pune',
      //   available: true
      // },
      // {
      //   id: '14',
      //   name: 'Pooja Singh',
      //   bloodType: 'AB+',
      //   distance: 8.2,
      //   lastDonated: '2024-06-03',
      //   phone: '9123456700',
      //   location: 'Bhosari, Pune',
      //   available: true
      // },
      // {
      //   id: '15',
      //   name: 'Aakash Jain',
      //   bloodType: 'O+',
      //   distance: 9.0,
      //   lastDonated: '2024-05-30',
      //   phone: '9000001111',
      //   location: 'Dhanori, Pune',
      //   available: false
      // },
      // {
      //   id: '16',
      //   name: 'Neha Kamat',
      //   bloodType: 'A+',
      //   distance: 7.5,
      //   lastDonated: '2024-05-22',
      //   phone: '9112233445',
      //   location: 'Kalyani Nagar, Pune',
      //   available: true
      // },
      // {
      //   id: '17',
      //   name: 'Sanjay Sawant',
      //   bloodType: 'B-',
      //   distance: 8.7,
      //   lastDonated: '2024-04-18',
      //   phone: '9223344556',
      //   location: 'Sinhagad Road, Pune',
      //   available: true
      // },
      // {
      //   id: '18',
      //   name: 'Ritika Desai',
      //   bloodType: 'AB-',
      //   distance: 6.9,
      //   lastDonated: '2024-05-10',
      //   phone: '9334455667',
      //   location: 'Bibwewadi, Pune',
      //   available: false
      // },
      // {
      //   id: '19',
      //   name: 'Manoj Kumar',
      //   bloodType: 'O+',
      //   distance: 5.3,
      //   lastDonated: '2024-06-04',
      //   phone: '9445566778',
      //   location: 'Vadgaon, Pune',
      //   available: true
      // },
      // {
      //   id: '20',
      //   name: 'Shweta Rao',
      //   bloodType: 'A+',
      //   distance: 7.8,
      //   lastDonated: '2024-05-27',
      //   phone: '9556677889',
      //   location: 'Warje, Pune',
      //   available: true
      // },
      // {
      //   id: '21',
      //   name: 'Nilesh Tiwari',
      //   bloodType: 'B+',
      //   distance: 12.1,
      //   lastDonated: '2024-05-11',
      //   phone: '9667788990',
      //   location: 'Dhankawadi, Pune',
      //   available: true
      // },
      // {
      //   id: '22',
      //   name: 'Deepa Choudhary',
      //   bloodType: 'O-',
      //   distance: 13.4,
      //   lastDonated: '2024-04-29',
      //   phone: '9778899001',
      //   location: 'Karvenagar, Pune',
      //   available: false
      // },
      // {
      //   id: '23',
      //   name: 'Sagar Kale',
      //   bloodType: 'A-',
      //   distance: 11.7,
      //   lastDonated: '2024-05-19',
      //   phone: '9889900112',
      //   location: 'Balewadi, Pune',
      //   available: true
      // },
      // {
      //   id: '24',
      //   name: 'Priyanka Joshi',
      //   bloodType: 'AB+',
      //   distance: 14.2,
      //   lastDonated: '2024-06-05',
      //   phone: '9990011223',
      //   location: 'Sus, Pune',
      //   available: true
      // },
      // {
      //   id: '25',
      //   name: 'Ramesh Verma',
      //   bloodType: 'O+',
      //   distance: 10.9,
      //   lastDonated: '2024-05-31',
      //   phone: '9001122334',
      //   location: 'Narhe, Pune',
      //   available: false
      // },
      // {
      //   id: '26',
      //   name: 'Snehal Patil',
      //   bloodType: 'A+',
      //   distance: 13.8,
      //   lastDonated: '2024-05-23',
      //   phone: '9112233446',
      //   location: 'Ambegaon, Pune',
      //   available: true
      // },
      // {
      //   id: '27',
      //   name: 'Ajay Shinde',
      //   bloodType: 'B-',
      //   distance: 12.5,
      //   lastDonated: '2024-04-19',
      //   phone: '9223344557',
      //   location: 'Bavdhan, Pune',
      //   available: true
      // },
      // {
      //   id: '28',
      //   name: 'Komal Waghmare',
      //   bloodType: 'AB-',
      //   distance: 14.7,
      //   lastDonated: '2024-05-09',
      //   phone: '9334455668',
      //   location: 'Katraj, Pune',
      //   available: false
      // },
      // {
      //   id: '29',
      //   name: 'Vijay Pawar',
      //   bloodType: 'O+',
      //   distance: 11.3,
      //   lastDonated: '2024-06-06',
      //   phone: '9445566779',
      //   location: 'Pimple Saudagar, Pune',
      //   available: true
      // },
      // {
      //   id: '30',
      //   name: 'Madhuri Deshmukh',
      //   bloodType: 'A+',
      //   distance: 13.2,
      //   lastDonated: '2024-05-26',
      //   phone: '9556677890',
      //   location: 'Erandwane, Pune',
      //   available: true
      // },
      // {
      //   id: '31',
      //   name: 'Gaurav Kulkarni',
      //   bloodType: 'B+',
      //   distance: 2.6,
      //   lastDonated: '2024-05-13',
      //   phone: '9001234001',
      //   location: 'Pimple Gurav, Pune',
      //   available: true
      // },
      // {
      //   id: '32',
      //   name: 'Rashmi Jadhav',
      //   bloodType: 'O-',
      //   distance: 3.1,
      //   lastDonated: '2024-04-27',
      //   phone: '9001234002',
      //   location: 'Akurdi, Pune',
      //   available: false
      // },
      // {
      //   id: '33',
      //   name: 'Nitin Salunkhe',
      //   bloodType: 'A-',
      //   distance: 1.9,
      //   lastDonated: '2024-05-21',
      //   phone: '9001234003',
      //   location: 'Sinhagad Road, Pune',
      //   available: true
      // },
      // {
      //   id: '34',
      //   name: 'Sheetal Pawar',
      //   bloodType: 'AB+',
      //   distance: 4.5,
      //   lastDonated: '2024-06-07',
      //   phone: '9001234004',
      //   location: 'Magarpatta, Pune',
      //   available: true
      // },
      // {
      //   id: '35',
      //   name: 'Pravin Shinde',
      //   bloodType: 'O+',
      //   distance: 0.9,
      //   lastDonated: '2024-05-29',
      //   phone: '9001234005',
      //   location: 'Koregaon Park, Pune',
      //   available: false
      // },
      // {
      //   id: '36',
      //   name: 'Aarti Patil',
      //   bloodType: 'A+',
      //   distance: 5.3,
      //   lastDonated: '2024-05-24',
      //   phone: '9001234006',
      //   location: 'Bavdhan, Pune',
      //   available: true
      // },
      // {
      //   id: '37',
      //   name: 'Siddharth Joshi',
      //   bloodType: 'B-',
      //   distance: 2.2,
      //   lastDonated: '2024-05-14',
      //   phone: '9001234007',
      //   location: 'Deccan, Pune',
      //   available: true
      // },
      // {
      //   id: '38',
      //   name: 'Manasi Desai',
      //   bloodType: 'AB-',
      //   distance: 3.8,
      //   lastDonated: '2024-05-17',
      //   phone: '9001234008',
      //   location: 'Camp, Pune',
      //   available: false
      // },
      // {
      //   id: '39',
      //   name: 'Harshad Kamat',
      //   bloodType: 'O+',
      //   distance: 1.5,
      //   lastDonated: '2024-06-08',
      //   phone: '9001234009',
      //   location: 'Karve Nagar, Pune',
      //   available: true
      // },
      // {
      //   id: '40',
      //   name: 'Pallavi Gokhale',
      //   bloodType: 'A+',
      //   distance: 2.7,
      //   lastDonated: '2024-05-28',
      //   phone: '9001234010',
      //   location: 'Parvati, Pune',
      //   available: true
      // },
      // {
      //   id: '41',
      //   name: 'Yogesh Sawant',
      //   bloodType: 'B+',
      //   distance: 6.5,
      //   lastDonated: '2024-05-16',
      //   phone: '9001234011',
      //   location: 'Kothrud, Pune',
      //   available: true
      // },
      // {
      //   id: '42',
      //   name: 'Rupali Naik',
      //   bloodType: 'O-',
      //   distance: 7.3,
      //   lastDonated: '2024-04-26',
      //   phone: '9001234012',
      //   location: 'Hadapsar, Pune',
      //   available: false
      // },
      // {
      //   id: '43',
      //   name: 'Kiran Patkar',
      //   bloodType: 'A-',
      //   distance: 5.6,
      //   lastDonated: '2024-05-18',
      //   phone: '9001234013',
      //   location: 'Vishrantwadi, Pune',
      //   available: true
      // },
      // {
      //   id: '44',
      //   name: 'Sneha Dighe',
      //   bloodType: 'AB+',
      //   distance: 8.4,
      //   lastDonated: '2024-06-09',
      //   phone: '9001234014',
      //   location: 'Dighi, Pune',
      //   available: true
      // },
      // {
      //   id: '45',
      //   name: 'Rohan Shetty',
      //   bloodType: 'O+',
      //   distance: 9.2,
      //   lastDonated: '2024-05-30',
      //   phone: '9001234015',
      //   location: 'Lohegaon, Pune',
      //   available: false
      // },
      // {
      //   id: '46',
      //   name: 'Vaishali Kamat',
      //   bloodType: 'A+',
      //   distance: 7.7,
      //   lastDonated: '2024-05-23',
      //   phone: '9001234016',
      //   location: 'Yerwada, Pune',
      //   available: true
      // },
      // {
      //   id: '47',
      //   name: 'Sandeep More',
      //   bloodType: 'B-',
      //   distance: 8.9,
      //   lastDonated: '2024-04-20',
      //   phone: '9001234017',
      //   location: 'Mundhwa, Pune',
      //   available: true
      // },
      // {
      //   id: '48',
      //   name: 'Bhavana Shah',
      //   bloodType: 'AB-',
      //   distance: 6.7,
      //   lastDonated: '2024-05-11',
      //   phone: '9001234018',
      //   location: 'Wanowrie, Pune',
      //   available: false
      // },
      // {
      //   id: '49',
      //   name: 'Ashok Mishra',
      //   bloodType: 'O+',
      //   distance: 5.5,
      //   lastDonated: '2024-06-10',
      //   phone: '9001234019',
      //   location: 'Kondhwa, Pune',
      //   available: true
      // },
      // {
      //   id: '50',
      //   name: 'Nikita Borkar',
      //   bloodType: 'A+',
      //   distance: 7.2,
      //   lastDonated: '2024-05-29',
      //   phone: '9001234020',
      //   location: 'Baner, Pune',
      //   available: true
      // }
    ];
    setDonors(mockDonors);
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      let results = [...donors];
      
      // Filter by blood type if selected
      if (bloodType) {
        results = results.filter(donor => donor.bloodType === bloodType);
      }
      
      // Filter by distance
      results = results.filter(donor => donor.distance <= distance);
      
      // Filter by availability if checked
      if (onlyAvailable) {
        results = results.filter(donor => donor.available);
      }
      
      // Sort by distance
      results.sort((a, b) => a.distance - b.distance);
      
      setFilteredDonors(results);
      setIsLoading(false);
    }, 1000);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Find Blood Donors</h1>
       
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type
            </label>
            <BloodTypeSelector value={bloodType} onChange={setBloodType} />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-end">
           <button
  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600"
  onClick={handleSearch}
>
  Search Donors
</button>

          </div>
        </div>
        
       
        
     
        
        {hasSearched && (
            <>
              {filteredDonors.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Available Donors</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDonors.map((donor) => (
                      <div key={donor.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                        <div className="flex justify-between mb-2">
                          <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                            {donor.bloodType}
                          </span>
                        </div>
                        <h3 className="font-medium text-lg mb-2">{donor.name}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start text-sm">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                            <span className="text-gray-700">{donor.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-700">Last donated: {donor.lastDonated}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-700">{donor.phone}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${donor.available ? 'text-green-600' : 'text-gray-500'}`}>
                            {donor.available ? 'Available to donate' : 'Currently unavailable'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">No donors found .</p>
                </div>
              )}
            </>
        )}
      </div>
      
      
      
     
    </div>
  );
};

export default BloodSearch;