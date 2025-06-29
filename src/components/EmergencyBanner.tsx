import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmergencyBannerProps {
  bloodType?: string;
}

const EmergencyBanner = ({ bloodType }: EmergencyBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-red-600 text-white py-3 px-4 flex items-center justify-between animate-pulse">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <p className="text-sm md:text-base">
          <strong>Emergency Need:</strong> {bloodType ? `${bloodType} blood` : 'All blood types'} urgently required.
          <Link to="/search" className="underline ml-2 font-semibold">
            Find donors now
          </Link>
        </p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-white hover:text-gray-200 transition duration-200"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default EmergencyBanner;