"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const MapComponentWithNoSSR = dynamic(() => import('@/components/core/map'), {
    ssr: false
});

export default function UserMap({ map }: { map: "sos" | "markers" }) {

    const MemoizedMapComponent = useMemo(() => <MapComponentWithNoSSR />, []);

    if (map === "markers") return (
        <section className="z-10 h-15 full center">
                <div className="relative h-50 w-full min-h-[300px] overflow-hidden shadow-lg border border-gray-300">
                    {MemoizedMapComponent}
                </div>
        </section>
    );
    if (map === "sos") return (
        <section className="z-10 h-15 full center">
                <div className="relative h-50 w-full min-h-[300px] overflow-hidden shadow-lg border border-gray-300">
                    {MemoizedMapComponent}
                </div>
        </section>
    );
};
