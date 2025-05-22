// src/components/CitySelect.tsx

import React from "react";
import { dictionary } from "../data/dictionary";

interface CitySelectProps {
  country: string;
  province?: string;
  city?: string;
  onChange: (city: string) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({
  country,
  province,
  city,
  onChange,
}) => {
  // China logic: show cities under selected province, optional select
  if (country === "CN") {
    if (!province) return null;
    const cities = dictionary.CN.cities[province] || {};
    return (
      <select value={city || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">(Optional) Select City</option>
        {Object.entries(cities).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    );
  }

  // Other country logic: cities are flat, city is required
  const cities = (dictionary[country] as any)?.cities || {};
  return (
    <select value={city || ""} onChange={(e) => onChange(e.target.value)} required>
      <option value="" disabled>
        Select City
      </option>
      {Object.entries(cities).map(([code, value]) => (
        <option key={code} value={code}>
          {typeof value === "string" ? value : value.name}
        </option>
      ))}
    </select>
  );
};

export default CitySelect;
