// MapScreen.js (Refactored main component)
import React, { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { YStack } from 'tamagui';
import { router } from 'expo-router';

// Import all the broken-down components
import MapHeader from '~/assets/ui/components/map/MapHeader';
import MapContainer from '~/assets/ui/components/map/MapContainer';
import AddMarkerModal from '~/assets/ui/components/map/AddMarkerModal';
import { generateMapHTML } from '~/assets/ui/components/map/mapHtmlGenerator';
import { getMarkerColor, getCurrentLocation, searchLocation } from '~/assets/ui/components/map/mapUtils';

// Import database
import { database } from '~/database';
import MyMission from '~/database/models/MyMission';
import GlobalMission from '~/database/models/GlobalMission';

// Types
interface Location {
    latitude: number;
    longitude: number;
}

interface MarkerData {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
    type: string;
    urgency: string;
    paymentType?: string;
    amount?: number;
}

interface SelectedCoordinate {
    latitude: number;
    longitude: number;
}

export default function MapScreen() {
    const [currentLocation, setCurrentLocation] = useState<Location>({
        latitude: 36.7538,
        longitude: 3.0588
    });

    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showAddMarker, setShowAddMarker] = useState(false);
    const [newMarker, setNewMarker] = useState({
        title: '',
        description: '',
        type: 'volunteer',
        urgency: 'flexible'
    });
    const [selectedCoordinate, setSelectedCoordinate] = useState<SelectedCoordinate | null>(null);

    const webViewRef = useRef<any>(null);

    useEffect(() => {
        handleGetCurrentLocation();
        fetchMissions();
    }, []);

    // Function to fetch missions from database
    const fetchMissions = async () => {
        try {
            // Fetch both MyMissions and GlobalMissions
            const myMissions = await database.get<MyMission>('my_missions')
                .query()
                .fetch();
            
            const globalMissions = await database.get<GlobalMission>('global_missions')
                .query()
                .fetch();

            // Convert missions to markers
            const missionMarkers: MarkerData[] = [
                ...myMissions.map(mission => ({
                    id: mission.id,
                    latitude: mission.latitude,
                    longitude: mission.longitude,
                    title: mission.title,
                    description: mission.description,
                    type: mission.paymentType.toLowerCase(),
                    urgency: mission.urgency.toLowerCase(),
                    paymentType: mission.paymentType,
                    amount: mission.amount
                })),
                ...globalMissions.map(mission => ({
                    id: mission.id,
                    latitude: mission.latitude,
                    longitude: mission.longitude,
                    title: mission.title,
                    description: mission.description,
                    type: mission.paymentType.toLowerCase(),
                    urgency: mission.urgency.toLowerCase(),
                    paymentType: mission.paymentType,
                    amount: mission.amount
                }))
            ];

            setMarkers(missionMarkers);
        } catch (error) {
            console.error('Error fetching missions:', error);
            // Fallback to empty array if there's an error
            setMarkers([]);
        }
    };

    const handleGetCurrentLocation = async () => {
        const location = await getCurrentLocation();
        if (location) {
            setCurrentLocation(location);
            // Center map on current location
            webViewRef.current?.postMessage(JSON.stringify({
                type: 'centerMap',
                latitude: location.latitude,
                longitude: location.longitude
            }));
        }
    };

    const handleSearchLocation = async () => {
        setIsSearching(true);
        const searchResult = await searchLocation(searchQuery);
        if (searchResult) {
            webViewRef.current?.postMessage(JSON.stringify({
                type: 'centerMap',
                latitude: searchResult.latitude,
                longitude: searchResult.longitude
            }));
        }
        setIsSearching(false);
    };

    const addNewMarker = () => {
        if (!newMarker.title.trim() || !selectedCoordinate) {
            Alert.alert('Error', 'Please fill in the title');
            return;
        }

        const marker = {
            id: Date.now().toString(),
            latitude: selectedCoordinate.latitude,
            longitude: selectedCoordinate.longitude,
            title: newMarker.title,
            description: newMarker.description,
            type: newMarker.type,
            urgency: newMarker.urgency
        };

        const updatedMarkers = [...markers, marker];
        setMarkers(updatedMarkers);

        // Update map with new marker
        webViewRef.current?.postMessage(JSON.stringify({
            type: 'updateMarkers',
            markers: updatedMarkers
        }));

        setShowAddMarker(false);
        setNewMarker({ title: '', description: '', type: 'volunteer', urgency: 'flexible' });
        setSelectedCoordinate(null);
        Alert.alert('Success', 'Mission marker added successfully!');
    };

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'mapClick') {
                setSelectedCoordinate({
                    latitude: data.latitude,
                    longitude: data.longitude
                });
                setShowAddMarker(true);
            }
        } catch (error) {
            console.log('Error parsing WebView message:', error);
        }
    };

    const handleAddMarkerPress = () => {
        Alert.alert('Add Marker', 'Tap anywhere on the map to add a new mission marker');
    };

    // Generate the HTML for the map
    const mapHTML = generateMapHTML(currentLocation, markers);

    return (
        <YStack f={1} bg="#f8f9fa">
            <MapHeader
                onBackPress={() => router.back()}
                onLocationPress={handleGetCurrentLocation}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearchLocation}
                isSearching={isSearching}
            />

            <MapContainer
                webViewRef={webViewRef}
                mapHTML={mapHTML}
                onWebViewMessage={handleWebViewMessage}
                onLocationPress={handleGetCurrentLocation}
                onAddMarkerPress={handleAddMarkerPress}
            />

            <AddMarkerModal
                visible={showAddMarker}
                onClose={() => setShowAddMarker(false)}
                newMarker={newMarker}
                setNewMarker={setNewMarker}
                onAddMarker={addNewMarker}
                getMarkerColor={getMarkerColor}
            />
        </YStack>
    );
}