import { useState } from 'react';

interface BloodTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const BloodTypeSelector = ({ value, onChange }: BloodTypeSelectorProps) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="bg-white border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center w-full focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || 'Select Blood Type'}</span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
          <ul className="grid grid-cols-2 gap-1 p-2">
            {bloodTypes.map((type) => (
              <li key={type}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-100 ${
                    value === type ? 'bg-red-100 text-red-700 font-medium' : ''
                  }`}
                  onClick={() => {
                    onChange(type);
                    setIsOpen(false);
                  }}
                >
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BloodTypeSelector;