import { Link } from 'react-router-dom';
import { Droplet, Search, UserPlus, Award } from 'lucide-react';
import EmergencyBanner from '../components/EmergencyBanner';

const Home = () => {
  return (
    <div className="flex flex-col space-y-12">
      {/* Emergency Banner */}
      <EmergencyBanner bloodType="O-" />
      
      {/* Hero Section */}
      <section className="text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Donate Blood, <span className="text-red-600">Save Lives</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Connect with blood donors in your area for emergency situations.
            Every donation matters, every life counts.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              to="/register"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-200 flex items-center justify-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Become a Donor
            </Link>
            <Link
              to="/search"
              className="bg-white text-red-600 border-2 border-red-600 px-6 py-3 rounded-md hover:bg-red-50 transition duration-200 flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Blood
            </Link>
          </div>
        </div>
      </section>
      
      {/* Blood Types Section */}
      <section className="py-12 bg-gray-100 rounded-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Blood Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
              <div key={type} className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition duration-200">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
                  <Droplet className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{type}</h3>
                <p className="text-gray-600 mt-2">
                  {type.includes('O') ? 'Universal donor' : type.includes('AB') ? 'Universal recipient' : 'Common type'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <UserPlus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Register as a Donor</h3>
            <p className="text-gray-600">
              Create an account and provide your blood type, location, and contact details to join our network of donors.
            </p>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
              <Droplet className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Update Availability</h3>
            <p className="text-gray-600">
              Keep your profile updated with your current availability to donate blood when needed.
            </p>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Connect in Emergencies</h3>
            <p className="text-gray-600">
              Recipients can search for donors by blood type and location during emergencies and contact them directly.
            </p>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-red-600 text-white py-12 rounded-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <p className="text-xl">Registered Donors</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <p className="text-xl">Lives Saved</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-xl">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-gray-600">Recipient</p>
              </div>
            </div>
            <p className="text-gray-700">
              "BloodConnect helped me find a donor in an emergency situation for my mother. The quick response saved her life. I'm forever grateful to this platform."
            </p>
            <div className="flex mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Award key={star} className="h-5 w-5 text-yellow-500" />
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h3 className="font-semibold text-lg">Jane Smith</h3>
                <p className="text-gray-600">Donor</p>
              </div>
            </div>
            <p className="text-gray-700">
              "Being a part of BloodConnect gives me immense satisfaction. I've donated multiple times through connections made on this platform, and it feels great to help save lives."
            </p>
           
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-12 rounded-lg text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">
            Join our network of donors and help save lives in your community.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              to="/register"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-200"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-md hover:bg-white hover:text-gray-900 transition duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;