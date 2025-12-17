import React from 'react';

interface CustomMapProps {
  selectedCountry?: string;
  selectedProvince?: string;
  selectedCity?: string;
  cityLocation?: { lat: number; lon: number; name: string };
}

const CustomMap: React.FC<CustomMapProps> = () => {
  return (
    <div className="w-full h-[400px] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
      <p className="text-gray-500">Map feature has been removed</p>
    </div>
  );
};

export default CustomMap;
