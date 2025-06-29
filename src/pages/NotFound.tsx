import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <AlertTriangle className="h-16 w-16 text-red-600 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link
            to="/"
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-200"
          >
            Go to Home
          </Link>
          <Link
            to="/search"
            className="bg-white text-red-600 border-2 border-red-600 px-6 py-3 rounded-md hover:bg-red-50 transition duration-200"
          >
            Find Blood
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;