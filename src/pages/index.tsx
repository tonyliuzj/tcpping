// src/pages/index.tsx

import React, { useState } from "react";
import { ProtocolSelect, Protocol } from "../components/ProtocolSelect";
import CitySelect from "../components/CitySelect";
import ProvinceSelect from "../components/ProvinceSelect";
import ProviderSelect from "../components/ProviderSelect";

const countries = [
  { code: "CN", name: "China" },
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  // ...add more as needed
];

export default function Home() {
  const [protocol, setProtocol] = useState<Protocol>(""); // "" = dual stack
  const [country, setCountry] = useState<string>("CN");
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Handle cascading resets
  const handleCountryChange = (val: string) => {
    setCountry(val);
    setProvince("");
    setCity("");
    setProvider("");
    setCopied(false);
  };
  const handleProvinceChange = (val: string) => {
    setProvince(val);
    setCity("");
    setProvider("");
    setCopied(false);
  };
  const handleCityChange = (val: string) => {
    setCity(val);
    setProvider("");
    setCopied(false);
  };
  const handleProviderChange = (val: string) => {
    setProvider(val);
    setCopied(false);
  };
  const handleProtocolChange = (val: Protocol) => {
    setProtocol(val);
    setCopied(false);
  };

  // URL generation logic
  const urlProtocol = protocol === "" ? "tcp" : protocol;
  let generatedUrl = "";
  if (urlProtocol && provider && country) {
    if (country === "CN") {
      if (city) {
        generatedUrl = `${urlProtocol}.${provider}-${city}.${country.toLowerCase()}.tcpping.top`;
      } else {
        generatedUrl = `${urlProtocol}.${provider}.${country.toLowerCase()}.tcpping.top`;
      }
    } else if (city) {
      generatedUrl = `${urlProtocol}.${provider}-${city}.${country.toLowerCase()}.tcpping.top`;
    }
  }

  // Copy to clipboard function
  const copyToClipboard = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Project Location and Provider Selection
        </h1>
        <form className="space-y-5">
          {/* Protocol selector */}
          <div>
            <label className="block mb-1 font-medium">Protocol</label>
            <ProtocolSelect protocol={protocol} onChange={handleProtocolChange} />
          </div>
          {/* Country Selector */}
          <div>
            <label className="block mb-1 font-medium">Country</label>
            <select
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              value={country}
              onChange={e => handleCountryChange(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          {/* Province Selector (China only) */}
          {country === "CN" && (
            <div>
              <label className="block mb-1 font-medium">Province</label>
              <ProvinceSelect
                country={country}
                province={province}
                onChange={handleProvinceChange}
              />
            </div>
          )}
          {/* City Selector */}
          <div>
            <label className="block mb-1 font-medium">
              City {country !== "CN" && <span className="text-red-500">*</span>}
            </label>
            <CitySelect
              country={country}
              province={country === "CN" ? province : undefined}
              city={city}
              onChange={handleCityChange}
            />
          </div>
          {/* Provider Selector */}
          <div>
            <label className="block mb-1 font-medium">Provider</label>
            <ProviderSelect
              country={country}
              province={country === "CN" ? province : undefined}
              city={city}
              provider={provider}
              onChange={handleProviderChange}
            />
          </div>
        </form>

        {/* Summary */}
        <div className="mt-8 bg-gray-100 rounded p-4 text-sm">
          <span className="font-semibold">Selected:</span>
          <div>Protocol: <span className="font-mono">{protocol === "" ? "tcp (dual stack)" : protocol}</span></div>
          <div>Country: <span className="font-mono">{country}</span></div>
          {country === "CN" && (
            <div>Province: <span className="font-mono">{province}</span></div>
          )}
          <div>City: <span className="font-mono">{city}</span></div>
          <div>Provider: <span className="font-mono">{provider}</span></div>
        </div>

        {/* Generated URL and Copy Button */}
        {generatedUrl && (
          <div className="mt-6 flex flex-col items-center">
            <div className="p-4 rounded bg-blue-50 text-blue-700 font-mono text-center break-all">
              {generatedUrl}
            </div>
            <button
              type="button"
              className={`mt-3 px-4 py-2 rounded transition bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none ${copied ? "bg-green-600" : ""}`}
              onClick={copyToClipboard}
            >
              {copied ? "Copied!" : "Click to Copy"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
