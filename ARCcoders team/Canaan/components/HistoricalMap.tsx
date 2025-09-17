"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
// Fix for default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type Event = {
  title: string;
  date: string;
  description: string;
  position: [number, number];
};
type EventList = Event[];
const HistoricalMap = ({ events }: { events: EventList }) => {
  const [groupedEvents, setGroupedEvents] = useState<Record<string, EventList>>(
    {}
  );
  useEffect(() => {
    const groupedEvents = events.reduce((acc, event) => {
      const key = JSON.stringify(event.position);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {} as Record<string, EventList>);
    setGroupedEvents(groupedEvents);
  }, [events]);

  return (
    <MapContainer
      center={[31.5, 34.75]}
      zoom={8}
      style={{ height: "calc(100vh - 100px)", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {Object.entries(groupedEvents).map(([positionKey, eventsAtPosition]) => {
        const position = JSON.parse(positionKey) as [number, number];
        return (
          <Marker key={positionKey} position={[31.762, -95.63]}>
            <Popup>
              <EventCarousel events={eventsAtPosition} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
const EventCarousel = ({ events }: { events: EventList }) => {
  const [selectedEvent, setSelectedEvent] = useState<number>(0);
  const handleNextEventSelect = () => {
    setSelectedEvent((prev) => {
      if (prev + 1 < events.length) {
        return prev + 1;
      }
      return prev;
    });
  };
  const handlePrevEventSelect = () => {
    setSelectedEvent((prev) => {
      if (prev - 1 >= 0) {
        return prev - 1;
      }
      return prev;
    });
  };
  return (
    <div>
      {events.length > 1 && (
        <div className="flex gap-2">
          <button
            disabled={selectedEvent === 0}
            className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
            onClick={() => handlePrevEventSelect()}
          >
            Previous
          </button>
          <button
            disabled={selectedEvent === events.length - 1}
            className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
            onClick={() => handleNextEventSelect()}
          >
            Next
          </button>
        </div>
      )}
      {selectedEvent < events.length && (
        <div>
          <h3 className="text-lg font-bold">{events[selectedEvent].title}</h3>
          <h3>position: {events[selectedEvent].position}</h3>
          <p>
            <span className="font-bold">Date:</span>{" "}
            {events[selectedEvent].date}
          </p>
          <p>{events[selectedEvent].description}</p>
        </div>
      )}
    </div>
  );
};
export default HistoricalMap;
