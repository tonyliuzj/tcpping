// src/components/ProvinceSelect.tsx

import React from "react";
import { dictionary } from "../data/dictionary";

interface ProvinceSelectProps {
  country: string;
  province?: string;
  onChange: (province: string) => void;
}

const ProvinceSelect: React.FC<ProvinceSelectProps> = ({
  country,
  province,
  onChange,
}) => {
  if (country !== "CN") return null;

  const provinces = dictionary.CN.provinces;

  return (
    <select value={province || ""} onChange={(e) => onChange(e.target.value)} required>
      <option value="" disabled>
        Select Province
      </option>
      {Object.entries(provinces).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default ProvinceSelect;
