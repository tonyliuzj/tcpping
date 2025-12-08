import React, { useMemo, useEffect, useState } from "react";
import { geoPath, geoMercator } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

import worldTopo from "../data/world-topo.json";
import chinaTopo from "../data/china-topo.json";

interface CustomMapProps {
  selectedCountry?: string;
  selectedProvince?: string;
  selectedCity?: string;
  cityLocation?: { lat: number; lon: number; name: string };
}

const CustomMap: React.FC<CustomMapProps> = ({
  selectedCountry,
  selectedProvince,
  selectedCity,
  cityLocation,
}) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Determine which map to show
  const isChinaView = selectedCountry === "CN";

  // Load TopoJSON and convert to GeoJSON
  useEffect(() => {
    const topoData: Topology = isChinaView ? (chinaTopo as any) : (worldTopo as any);
    const objectKey = isChinaView ? "default" : "countries";
    const geoJson = feature(topoData, topoData.objects[objectKey] as GeometryCollection);
    setGeoData(geoJson);
  }, [isChinaView]);

  // Reset pan/zoom when country changes
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [selectedCountry, selectedProvince, selectedCity]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setTranslate({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(5, prev * delta)));
  };

  if (!geoData) {
    return (
      <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const width = 800;
  const height = 400;

  // Create projection
  const projection = geoMercator().fitSize([width, height], geoData);
  const pathGenerator = geoPath().projection(projection);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto bg-gray-50"
        style={{ cursor: isPanning ? 'grabbing' : 'grab', minHeight: '400px' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
          {/* Render map features */}
          {geoData.features
            ?.filter((feature: any) => {
              if (!isChinaView) return true;
              // For China, only show province-level features
              return feature.properties?.level === 1;
            })
            .map((feature: any, i: number) => {
              const isSelected = isChinaView
                ? feature.properties?.code === selectedProvince
                : feature.properties?.name === selectedCountry;

              const pathData = pathGenerator(feature);
              if (!pathData) return null;

              return (
                <path
                  key={`feature-${i}`}
                  d={pathData}
                  fill={isSelected ? "#3b82f6" : "#e5e7eb"}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  className="transition-colors duration-200 hover:fill-gray-300"
                />
              );
            })}

          {/* Render city marker if location is provided */}
          {cityLocation && (
            <g>
              <circle
                cx={projection([cityLocation.lon, cityLocation.lat])?.[0]}
                cy={projection([cityLocation.lon, cityLocation.lat])?.[1]}
                r={5}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth={2}
                className="animate-pulse"
              />
              <text
                x={projection([cityLocation.lon, cityLocation.lat])?.[0]}
                y={(projection([cityLocation.lon, cityLocation.lat])?.[1] || 0) - 10}
                fontSize="12"
                fill="#1f2937"
                textAnchor="middle"
                className="font-semibold"
              >
                {cityLocation.name}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setScale(prev => Math.min(5, prev * 1.2))}
          className="w-8 h-8 bg-white rounded shadow hover:bg-gray-100 flex items-center justify-center text-lg font-bold border border-gray-300"
        >
          +
        </button>
        <button
          onClick={() => setScale(prev => Math.max(0.5, prev / 1.2))}
          className="w-8 h-8 bg-white rounded shadow hover:bg-gray-100 flex items-center justify-center text-lg font-bold border border-gray-300"
        >
          −
        </button>
        <button
          onClick={() => {
            setScale(1);
            setTranslate({ x: 0, y: 0 });
          }}
          className="w-8 h-8 bg-white rounded shadow hover:bg-gray-100 flex items-center justify-center text-sm border border-gray-300"
        >
          ⟲
        </button>
      </div>

      {/* Info display */}
      {selectedCountry && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          {isChinaView ? (
            <>
              <span className="font-semibold">China</span>
              {selectedProvince && <span> → Province: {selectedProvince}</span>}
              {selectedCity && <span> → City: {selectedCity}</span>}
            </>
          ) : (
            <>
              <span className="font-semibold">Country: {selectedCountry}</span>
              {selectedCity && <span> → City: {selectedCity}</span>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomMap;
