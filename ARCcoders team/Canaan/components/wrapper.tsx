"use client";
import { useState } from "react";
import events from "../../merged_data.json";
import Timeline from "./Timeline";
import dynamic from "next/dynamic";
const HistoricalMap = dynamic(() => import("./HistoricalMap"), {
  ssr: false,
});

const getYearFromDate = (date: string): number => {
  if (!date) {
    return 0;
  }
  // Take the first part of a range
  const datePart = date.split(" - ")[0];
  // Find the first 4-digit number
  const yearMatch = datePart.match(/\d{4}/);
  if (yearMatch) {
    return parseInt(yearMatch[0], 10);
  }
  return 0;
};

const Wrapper = () => {
  const editedEvents = events.map((ele) => {
    return {
      ...ele,
      year: getYearFromDate(ele.date),
    };
  });
  const minYear = Math.min(...editedEvents.map((e) => e.year));
  const maxYear = Math.max(...editedEvents.map((e) => e.year));
  const [selectedYear, setSelectedYear] = useState(minYear);

  const filteredEvents = editedEvents.filter((event) => {
    const eventYear = event.year;
    return eventYear === selectedYear;
  });

  return (
    <main>
      <HistoricalMap events={filteredEvents as any[]} />
      <Timeline
        min={minYear}
        max={maxYear}
        value={selectedYear}
        onChange={setSelectedYear}
      />
    </main>
  );
};
export default Wrapper;
