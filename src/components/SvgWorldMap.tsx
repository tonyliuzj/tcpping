import React, { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

import geoUrl from "../data/world-topo.json";
import chinaTopo from "../data/china-topo.json";

type MapFeatureProperties = {
  name?: string;
  fullname?: string;
  code?: string;
  level?: number;
};

type MapFeature = {
  rsmKey: string;
  properties?: MapFeatureProperties;
};

export interface WorldMapProps {
  mode: "default" | "country" | "province" | "city" | "lookup";
  cities?: { name: string; lat: number; lon: number }[];
  ipLocations?: { ip: string; label?: string; lat: number; lon: number }[];
  center?: [number, number]; // [lat, lon]
  zoom?: number; // Leaflet scale usually
  activeCountry?: string;
  activeProvince?: string;
}

// Convert Leaflet Zoom to react-simple-maps zoom
// Leaflet 2 (World) -> RSM 1
// Leaflet 5 (Country) -> RSM 4
// Leaflet 8 (Province) -> RSM 10
// Leaflet 10 (City) -> RSM 20
const mapZoomLevel = (lZoom: number) => {
  if (lZoom <= 2) return 1;
  if (lZoom <= 5) return 3;
  if (lZoom <= 8) return 8;
  return 15;
};

const SvgWorldMap: React.FC<WorldMapProps> = ({
  mode,
  cities = [],
  ipLocations = [],
  center = [20, 0],
  zoom = 2,
  activeCountry,
  activeProvince,
}) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isChinaView = activeCountry === "CN" && mode !== "lookup";
  const geographySource = isChinaView ? chinaTopo : geoUrl;
  const projectionConfig = isChinaView
    ? { scale: 650, center: [104, 35] }
    : { scale: 100 };
  // Combine markers
  const markers = useMemo(() => {
    const list: Array<{ lat: number; lon: number; name: string; type: 'city' | 'ip' }> = [];
    
    cities.forEach(c => list.push({ ...c, type: 'city' }));
    ipLocations.forEach(ip => list.push({ lat: ip.lat, lon: ip.lon, name: ip.label || ip.ip, type: 'ip' }));
    
    return list;
  }, [cities, ipLocations]);

  // Map center: Props are [lat, lon], RSM needs [lon, lat]
  const rsmCenter: [number, number] = [center[1], center[0]];
  const rsmZoom = mapZoomLevel(zoom);

  const handleMouseEnter = (name: string, event: React.MouseEvent) => {
    setTooltipContent(name);
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div 
      className="w-full h-[500px] bg-[#1a1a1a] rounded-2xl overflow-hidden relative border border-gray-800 shadow-xl"
      onMouseMove={tooltipContent ? handleMouseMove : undefined}
    >
      <ComposableMap projection="geoMercator" projectionConfig={projectionConfig} className="w-full h-full">
        <ZoomableGroup 
          center={rsmCenter} 
          zoom={rsmZoom}
          minZoom={1}
          maxZoom={100}
        >
          <Geographies geography={geographySource}>
            {({ geographies }: { geographies: MapFeature[] }) =>
              geographies
                .filter((geo) => {
                  if (!isChinaView) return true;
                  // Keep only province-level polygons to avoid oversized country outline/inset artifacts.
                  return geo.properties?.level === 1;
                })
                .map((geo) => {
                const countryName = geo.properties?.name;
                const isChina =
                  !isChinaView &&
                  (countryName === "China" || countryName === "Taiwan");
                const displayName = isChinaView
                  ? geo.properties?.fullname || geo.properties?.name
                  : countryName === "Taiwan"
                    ? "China"
                    : countryName;
                const isActiveProvince =
                  isChinaView &&
                  activeProvince &&
                  geo.properties?.code === activeProvince;
                const defaultFill = isChinaView
                  ? isActiveProvince
                    ? "#1f6feb"
                    : "#2f4b63"
                  : isChina
                    ? "#32465a"
                    : "#2b3543";
                const hoverFill = isChinaView ? "#3b5f7c" : "#3c5369";
                const stroke = isChinaView ? "#6b7280" : "#1f2a37";
                const strokeWidth = isChinaView ? 0.8 : 0.6;
              
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => displayName && handleMouseEnter(displayName, e)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: defaultFill,
                        stroke,
                        strokeWidth,
                        outline: "none",
                      },
                      hover: {
                        fill: hoverFill,
                        stroke: "#4b5563",
                        strokeWidth: strokeWidth + 0.2,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: defaultFill,
                        stroke,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {markers.map((marker, i) => (
            <Marker key={i} coordinates={[marker.lon, marker.lat]}>
              <circle
                r={marker.type === 'ip' ? 4 : 3}
                fill={marker.type === 'ip' ? "#F59E0B" : "#3B82F6"} // Amber for IP, Blue for Cities
                stroke="#fff"
                strokeWidth={1}
                className="animate-pulse"
                onMouseEnter={(e) => handleMouseEnter(marker.name, e)}
                onMouseLeave={handleMouseLeave}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Custom Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-50 px-3 py-1 text-sm text-white bg-black bg-opacity-80 rounded pointer-events-none backdrop-blur-sm border border-gray-700"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y + 10,
          }}
        >
          {tooltipContent}
        </div>
      )}
      
      {/* Overlay Info (Cool Factor) */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-mono">
        LAT: {center[0].toFixed(2)} | LON: {center[1].toFixed(2)} | ZOOM: {rsmZoom}
      </div>
    </div>
  );
};

export default SvgWorldMap;
