import { Link } from 'react-router-dom';
import { Droplet, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Droplet className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold">Blood<span className="text-red-500">Connect</span></span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting blood donors with recipients in emergencies. Our mission is to save lives through efficient blood donation networks.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-red-500 transition duration-200">Home</Link></li>
              <li><Link to="/search" className="text-gray-400 hover:text-red-500 transition duration-200">Find Blood</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-red-500 transition duration-200">Become a Donor</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-red-500 transition duration-200">Login</Link></li>
            </ul>
          </div>

          {/* Blood Types */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Blood Types</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 rounded p-2 text-center">A+</div>
              <div className="bg-gray-800 rounded p-2 text-center">A-</div>
              <div className="bg-gray-800 rounded p-2 text-center">B+</div>
              <div className="bg-gray-800 rounded p-2 text-center">B-</div>
              <div className="bg-gray-800 rounded p-2 text-center">AB+</div>
              <div className="bg-gray-800 rounded p-2 text-center">AB-</div>
              <div className="bg-gray-800 rounded p-2 text-center">O+</div>
              <div className="bg-gray-800 rounded p-2 text-center">O-</div>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <span className="text-gray-400">nagpur</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-400">9322215401</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-400">info@bloodconnect.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} BloodConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;