import React, { useState, useRef } from 'react';
import { YStack, XStack, Button, Text, Spinner } from 'tamagui';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '~/store/index';
import { HeaderA } from '~/assets/ui/components/headerA';
import { LinearGradient } from 'expo-linear-gradient';

export default function LocationPickerScreen() {
  const { setSelectedLocation, selectedLocation } = useAppStore();
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(
    selectedLocation ? { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude } : null
  );
  const [address, setAddress] = useState<string>(selectedLocation?.address || 'Tap on map to select location');
  const [isLoading, setIsLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const createLocationPickerHTML = () => {
    const initialLat = selectedLocation?.latitude || 31.3547; // Default to Gaza
    const initialLng = selectedLocation?.longitude || 34.3088;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          #map { height: 100vh; width: 100vw; }
          .controls {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 120px;
            overflow: hidden;
          }
          .location-info {
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
            line-height: 1.3;
          }
          .coordinates {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .pulse {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div class="controls">
          <div class="location-info" id="locationInfo">Tap on map to select location</div>
          <div class="coordinates" id="coordinates"></div>
        </div>
        
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          let map = L.map('map').setView([${initialLat}, ${initialLng}], 13);
          let currentMarker = null;
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Add initial marker if location exists
          ${selectedLocation ? `
            currentMarker = L.marker([${initialLat}, ${initialLng}], {
              icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background: #4a8a28; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(map);
          ` : ''}
          
          // Reverse geocoding function
          async function reverseGeocode(lat, lng) {
            try {
              const response = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lng}&zoom=18&addressdetails=1\`);
              const data = await response.json();
              return data.display_name || \`\${lat.toFixed(4)}, \${lng.toFixed(4)}\`;
            } catch (error) {
              console.error('Geocoding error:', error);
              return \`\${lat.toFixed(4)}, \${lng.toFixed(4)}\`;
            }
          }
          
          // Handle map clicks
          map.on('click', async function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            // Remove existing marker
            if (currentMarker) {
              map.removeLayer(currentMarker);
            }
            
            // Add new marker with pulse animation
            currentMarker = L.marker([lat, lng], {
              icon: L.divIcon({
                className: 'custom-marker pulse',
                html: '<div style="background: #4a8a28; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(map);
            
            // Update UI
            document.getElementById('locationInfo').textContent = 'Getting address...';
            document.getElementById('coordinates').textContent = \`\${lat.toFixed(6)}, \${lng.toFixed(6)}\`;
            
            // Get address
            const address = await reverseGeocode(lat, lng);
            document.getElementById('locationInfo').textContent = address;
            
            // Send location to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'locationSelected',
              latitude: lat,
              longitude: lng,
              address: address
            }));
          });
          
          // Handle search (if needed later)
          window.searchLocation = function(query) {
            // Implementation for search functionality
          };
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'locationSelected') {
        setCurrentLocation({
          latitude: data.latitude,
          longitude: data.longitude
        });
        setAddress(data.address);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleConfirmLocation = () => {
    if (!currentLocation) {
      Alert.alert('No Location Selected', 'Please tap on the map to select a location.');
      return;
    }

    // Save to store
    setSelectedLocation({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      address: address
    });

    // Navigate back
    router.back();
  };

  const handleCurrentLocation = () => {
    setIsLoading(true);
    
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Send location to WebView
        webViewRef.current?.postMessage(JSON.stringify({
          type: 'setLocation',
          latitude,
          longitude
        }));
        
        setCurrentLocation({ latitude, longitude });
        setIsLoading(false);
      },
      (error) => {
        console.error('Location error:', error);
        Alert.alert('Location Error', 'Could not get your current location. Please select manually on the map.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <YStack bg="white" pt="$4" pb="$2" px="$4">
        <HeaderA
          icon="close"
          presshandler={() => router.back()}
          name="Select Location"
        />
      </YStack>

      {/* Map */}
      <YStack f={1} position="relative">
        <WebView
          ref={webViewRef}
          source={{ html: createLocationPickerHTML() }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={handleWebViewMessage}
          renderLoading={() => (
            <YStack f={1} ai="center" jc="center" bg="$background">
              <Spinner size="large" color="$color" />
              <Text mt="$3" color="$color11">Loading map...</Text>
            </YStack>
          )}
        />

        {/* Current Location Button */}
        <XStack position="absolute" bottom={120} right={20}>
          <Button
            size="$4"
            circular
            bg="white"
            borderColor="$borderColor"
            borderWidth={1}
            onPress={handleCurrentLocation}
            disabled={isLoading}
            shadowColor="$shadowColor"
            shadowOpacity={0.1}
            shadowRadius={8}
            shadowOffset={{ width: 0, height: 2 }}
          >
            {isLoading ? (
              <Spinner size="small" color="$color" />
            ) : (
              <Ionicons name="location" size={24} color="#4a8a28" />
            )}
          </Button>
        </XStack>
      </YStack>

      {/* Bottom Panel */}
      <YStack bg="white" p="$4" borderTopWidth={1} borderTopColor="$borderColor">
        <YStack gap="$3" mb="$4">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            Selected Location
          </Text>
          <Text fontSize="$4" color="$color11" numberOfLines={2}>
            {address}
          </Text>
          {currentLocation && (
            <Text fontSize="$3" color="$color10">
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
          )}
        </YStack>

        <Button
          size="$4"
          bg="$background"
          onPress={handleConfirmLocation}
          disabled={!currentLocation}
          pressStyle={{ opacity: 0.8 }}
        >
          <LinearGradient
            colors={['#4a8a28', '#5a9a38']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: 12,
            }}
          />
          <Text color="white" fontWeight="600" fontSize="$4">
            Confirm Location
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}