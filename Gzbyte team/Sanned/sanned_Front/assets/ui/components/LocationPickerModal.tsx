import React, { useState } from 'react';
import { YStack, XStack, Button, Text, Sheet } from 'tamagui';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (location: { address: string; latitude: number; longitude: number }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  onLocationSelected,
  initialLocation = { latitude: 31.3547, longitude: 34.3088 } // Default to Gaza
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const createLocationPickerHTML = () => {
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
          }
          .location-info {
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
          }
          .confirm-btn {
            background: #4a8a28;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
          }
          .confirm-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          .marker {
            color: #ff4757;
            font-size: 24px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }
        </style>
      </head>
      <body>
        <div class="controls">
          <div class="location-info" id="locationInfo">
            📍 Tap on the map to select a location
          </div>
          <button class="confirm-btn" onclick="confirmLocation()" id="confirmBtn" disabled>
            Confirm Location
          </button>
        </div>
        <div id="map"></div>
        
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        
        <script>
          let map;
          let marker;
          let selectedCoords = null;
          
          function initMap() {
            try {
              map = L.map('map').setView([${initialLocation.latitude}, ${initialLocation.longitude}], 13);
              
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
              }).addTo(map);
              
              // Add click event to map
              map.on('click', function(e) {
                selectLocation(e.latlng.lat, e.latlng.lng);
              });
              
              // Add initial marker if we have coordinates
              selectLocation(${initialLocation.latitude}, ${initialLocation.longitude});
            } catch (error) {
              console.error('Map initialization error:', error);
              document.getElementById('locationInfo').innerHTML = 
                '❌ Map failed to load. Please try again.';
            }
          }
          
          function selectLocation(lat, lng) {
            selectedCoords = { lat, lng };
            
            try {
              // Remove existing marker
              if (marker) {
                map.removeLayer(marker);
              }
              
              // Add new marker
              marker = L.marker([lat, lng]).addTo(map);
              
              // Update location info
              document.getElementById('locationInfo').innerHTML = 
                \`📍 Selected: \${lat.toFixed(6)}, \${lng.toFixed(6)}\`;
              
              // Enable confirm button
              document.getElementById('confirmBtn').disabled = false;
              
              // Try to get address using reverse geocoding
              fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lng}\`)
                .then(response => response.json())
                .then(data => {
                  if (data && data.display_name) {
                    document.getElementById('locationInfo').innerHTML = 
                      \`📍 \${data.display_name.length > 50 ? data.display_name.substring(0, 50) + '...' : data.display_name}\`;
                  }
                })
                .catch(err => {
                  console.log('Geocoding error:', err);
                  // Keep the coordinates display if geocoding fails
                });
            } catch (error) {
              console.error('Location selection error:', error);
            }
          }
          
          function confirmLocation() {
            if (selectedCoords) {
              fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${selectedCoords.lat}&lon=\${selectedCoords.lng}\`)
                .then(response => response.json())
                .then(data => {
                  const address = data?.display_name || \`\${selectedCoords.lat.toFixed(6)}, \${selectedCoords.lng.toFixed(6)}\`;
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'locationSelected',
                    data: {
                      address: address,
                      latitude: selectedCoords.lat,
                      longitude: selectedCoords.lng
                    }
                  }));
                })
                .catch(() => {
                  // If geocoding fails, still return coordinates
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'locationSelected',
                    data: {
                      address: \`\${selectedCoords.lat.toFixed(6)}, \${selectedCoords.lng.toFixed(6)}\`,
                      latitude: selectedCoords.lat,
                      longitude: selectedCoords.lng
                    }
                  }));
                });
            }
          }
          
          // Initialize map when page loads
          window.addEventListener('load', function() {
            setTimeout(initMap, 100); // Small delay to ensure DOM is ready
          });
        </script>
      </body>
      </html>
    `;
  };

  const handleMapMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'locationSelected') {
        onLocationSelected(data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error parsing map message:', error);
    }
  };

  return (
    <Sheet
      modal={true}
      open={visible}
      onOpenChange={onClose}
      snapPointsMode="fit"
      dismissOnSnapToBottom
    >
      <Sheet.Frame bg="white" h="90%">
        <Sheet.Handle />
        <YStack f={1}>
          {/* Header */}
          <XStack ai="center" jc="space-between" p={20} borderBottomWidth={1} borderColor="$gray4">
            <Text fontSize={18} fontWeight="600">Select Location</Text>
            <Button
              size="$3"
              circular
              bg="transparent"
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="$gray10" />
            </Button>
          </XStack>

          {/* Map */}
          <YStack f={1}>
            <WebView
              source={{ html: createLocationPickerHTML() }}
              style={{ flex: 1 }}
              onMessage={handleMapMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo={true}
              allowsBackForwardNavigationGestures={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scalesPageToFit={true}
              startInLoadingState={true}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView HTTP error: ', nativeEvent);
              }}
              onLoadStart={() => console.log('WebView started loading')}
              onLoadEnd={() => console.log('WebView finished loading')}
            />
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default LocationPickerModal;