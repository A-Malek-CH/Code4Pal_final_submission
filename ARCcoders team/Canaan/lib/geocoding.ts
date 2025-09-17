
import { LRUCache } from 'lru-cache';

type GeocodeResult = {
    lat: number;
    lon: number;
};

const cache = new LRUCache<string, GeocodeResult>({
    max: 100,
    ttl: 1000 * 60 * 60 * 24, // 24 hours
});

export async function geocode(location: string): Promise<GeocodeResult | null> {
    const cached = cache.get(location);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`);
        if (!response.ok) {
            console.error(`Geocoding error for ${location}: ${response.statusText}`);
            return null;
        }
        const data = await response.json();
        if (data && data.length > 0) {
            const result = {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
            };
            cache.set(location, result);
            return result;
        }
    } catch (error) {
        console.error(`Geocoding request failed for ${location}:`, error);
    }

    return null;
}
