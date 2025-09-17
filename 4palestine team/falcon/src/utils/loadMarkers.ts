"use client";

import L from "leaflet";
import type { MarkerType } from "@/types/d_marker";

export default async function loadMarkers(mapRef: L.Map | null, markers: MarkerType[] = []) {

  if (mapRef) {
    markers.forEach((marker) => {
      const { id, lat, long, description, type, user_id, last_updated, reports } = marker;
      const position = [lat, long] as [number, number];

      const getIcon = (Marker: string) => {
        const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
          Marker === "food"
            ? "green"
            : Marker === "water"
            ? "blue"
            : Marker === "danger"
            ? "red"
            : "orange"
        }.png`;

        return new L.Icon({
          iconUrl,
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
      };

      const popupContent = `
        <div style="font-family: Arial, sans-serif; font-size: 14px;">
          <h3 style="margin-bottom: 5px; color: #333;">${
            type.charAt(0).toUpperCase() + type.slice(1)
          } Point</h3>
          <p style="margin-bottom: 10px; color: #555;">${description}</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;" />
          <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 5px;"><strong>Last Updated:</strong> ${last_updated.toLocaleDateString()}</li>
            <li style="margin-bottom: 5px;"><strong>Reports:</strong> ${reports}</li>
            <li><strong>User ID:</strong> ${user_id}</li>
          </ul>
        </div>
      `;

      L.marker(position, { icon: getIcon(type) })
        .addTo(mapRef)
        .bindPopup(popupContent)
        .on("click", () => {
          console.log(`Marker ${id} clicked`);
        });
      console.log(`Added marker ${id} at position ${position}`);
    });
  } else {
    console.error("Map reference is null. Cannot load markers.");
  }
}