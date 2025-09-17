"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import loadMarkers from "@/utils/loadMarkers";
import React, { useState, useRef, useEffect, JSX } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, } from "react-leaflet";
import { MapClickHandlerProps, MapInitializerProps, LatLngExpression, MapMarker, markerToMap } from "@/types/d_map";
import { MarkerType } from "@/types/d_marker";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapInitializer({ mapRef, pins }: MapInitializerProps) {

  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (mapRef.current) {
        loadMarkers(mapRef.current, pins);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      mapRef.current = null;
    };
  }, [map, mapRef]);

  return null;
}

export default function MapComponent({ lat, lng, pins }: { lat?: number; lng?: number; pins?: MarkerType[] }): JSX.Element {

  const defaultPosition: LatLngExpression = [lat ? lat : 31.5017, lng ? lng : 34.4668];

  const [markers, setMarkers] = useState<MapMarker[]>(markerToMap(pins) || []);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(defaultPosition);
  const [zoom, setZoom] = useState<number>(13);

  const mapRef = useRef<L.Map | null>(null);

  const handleMapClick = (lat: number, lng: number) => { };

  const removeMarker = (id: number) => {
    setMarkers((p) => p.filter((m) => m.id !== id));
  };

  const centerOnMarker = (position: LatLngExpression) => {
    setMapCenter(position);
    setZoom(15);
    mapRef.current?.invalidateSize();
  };

  const resetView = () => {
    setMapCenter(defaultPosition);
    setZoom(13);
    mapRef.current?.invalidateSize();
  };

  const clearAllMarkers = () => setMarkers([]);

  useEffect(() => {
    const handler = () => {
      mapRef.current?.invalidateSize();
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="w-full h-full z-0"
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapInitializer mapRef={mapRef} pins={pins} />

        <MapClickHandler onMapClick={handleMapClick} />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-gray-800">
                  {marker.label}
                </h3>
                <div className="mt-2 flex gap-2 justify-center">
                  <button
                    onClick={() => centerOnMarker(marker.position)}
                    className="px-2 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600"
                  >
                    Center Here
                  </button>
                  <button
                    onClick={() => removeMarker(marker.id)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div
        style={{ position: "absolute", top: 8, right: 8, zIndex: 999 }}
      >
        <div className="space-x-2">
          <button
            onClick={resetView}
            className="px-3 py-1 bg-emerald-700 text-white border rounded shadow-sm text-sm">
            Reset
          </button>
          <button
            onClick={() => clearAllMarkers()}
            className="px-3 py-1 bg-emerald-700 text-white border rounded shadow-sm text-sm">
            Clear markers
          </button>
        </div>
      </div>
    </>
  );
}