// src/components/ProviderSelect.tsx

import React from "react";
import { dictionary } from "../data/dictionary";

interface ProviderSelectProps {
  country: string;
  province?: string;
  city?: string;
  provider?: string;
  onChange: (provider: string) => void;
}

const ProviderSelect: React.FC<ProviderSelectProps> = ({
  country,
  city,
  provider,
  onChange,
}) => {
  let providers: Record<string, string> = {};

  if (country === "CN") {
    providers = dictionary.CN.providers;
  } else {
    const cityObj = (dictionary[country] as any)?.cities?.[city || ""] || {};
    providers = cityObj.providers || {};
  }

  return (
    <select value={provider || ""} onChange={(e) => onChange(e.target.value)} required>
      <option value="" disabled>
        Select Provider
      </option>
      {Object.entries(providers).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default ProviderSelect;
