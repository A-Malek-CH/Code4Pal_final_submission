// assets/ui/components/map/mapUtils.js
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const getMarkerColor = (urgency?: string, paymentType?: string): string => {
    // Primary colors based on payment type
    const baseColors: { [key: string]: string } = {
        'volunteer': '#4a8a28',  // Green for volunteer
        'paid': '#3b82f6',       // Blue for paid
        'sponsor': '#8b5cf6',    // Purple for sponsor
    };

    // Urgency affects opacity/shade
    const urgencyMultiplier: { [key: string]: number } = {
        'urgent': 1.0,      // Full intensity
        'soon': 0.8,        // Slightly dimmed
        'flexible': 0.6,    // More dimmed
    };

    const baseColor = baseColors[paymentType?.toLowerCase() || 'volunteer'] || baseColors['volunteer'];
    const multiplier = urgencyMultiplier[urgency?.toLowerCase() || 'flexible'] || urgencyMultiplier['flexible'];

    // For urgent items, we might want to use red regardless of type
    if (urgency?.toLowerCase() === 'urgent') {
        return '#ff4757'; // Red for urgent missions
    }

    return baseColor;
};

export const getCurrentLocation = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Location permission is required');
            return null;
        }

        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        console.log('Error getting location:', error);
        return null;
    }
};

export const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) return null;

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'SanadApp/1.0 (contact: salhiayoubabdelmoumen@rmail.com)',
                    'Accept': 'application/json',
                },
            }
        );

        const data = await response.json();
        console.log('Search data:', data);

        if (data.length > 0) {
            const result = data[0];
            return {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon)
            };
        } else {
            Alert.alert('Not Found', 'Location not found. Try a different search term.');
            return null;
        }
    } catch (error) {
        Alert.alert('Search Error', `Unable to search location. Please try again ${error}.`);
        console.log('Search error:', error);
        return null;
    }
};