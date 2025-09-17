"use client";

import dynamic from 'next/dynamic';

import { useMemo } from 'react';
import { dummyData } from '@/data/markers';
import { useSearchParams } from 'next/navigation';

const MapComponentWithNoSSR = dynamic(() => import('@/components/core/map'), {
  ssr: false
});

export default function Page() {
  const searchParams = useSearchParams();
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  // Convert to numbers safely
  const lat = latParam ? parseFloat(latParam) : undefined;
  const lng = lngParam ? parseFloat(lngParam) : undefined;

  const MemoizedMapComponent = useMemo(() => {
    return <MapComponentWithNoSSR lat={lat} lng={lng} pins={dummyData}/>;
  }, [lat, lng]);

  return (
    <section className="z-10">
      <div className="w-full">
        <div className="relative overflow-hidden shadow-lg border border-gray-300" style={{ height: "calc(100vh - 70px)", minHeight: "300px" }}>
          {MemoizedMapComponent}
        </div>
      </div>
    </section>
  );
}
