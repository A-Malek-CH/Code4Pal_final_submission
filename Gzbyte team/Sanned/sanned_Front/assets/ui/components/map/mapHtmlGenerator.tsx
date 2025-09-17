// assets/ui/components/map/mapHtmlGenerator.js

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

export const generateMapHTML = (currentLocation: Location, markers: MarkerData[]): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            let map;
            let markersLayer;
            
            function initMap() {
                map = L.map('map').setView([${currentLocation.latitude}, ${currentLocation.longitude}], 13);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
                
                markersLayer = L.layerGroup().addTo(map);
                
                // Handle map clicks
                map.on('click', function(e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'mapClick',
                        latitude: e.latlng.lat,
                        longitude: e.latlng.lng
                    }));
                });
                
                updateMarkers();
            }
            
            function updateMarkers() {
                markersLayer.clearLayers();
                const markers = ${JSON.stringify(markers)};
                
                markers.forEach(marker => {
                    const color = getMarkerColor(marker.urgency, marker.paymentType);
                    const icon = getMarkerIcon(marker.type);
                    
                    const customIcon = L.divIcon({
                        html: \`<div style="
                            background-color: \${color};
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            border: 3px solid white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: 14px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        ">\${icon}</div>\`,
                        className: 'custom-marker',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    });
                    
                    L.marker([marker.latitude, marker.longitude], { icon: customIcon })
                        .bindPopup(\`
                            <div style="font-family: Arial, sans-serif;">
                                <h3 style="margin: 0 0 8px 0; color: #333;">\${marker.title}</h3>
                                <p style="margin: 0 0 8px 0; color: #666;">\${marker.description}</p>
                                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                                    <span style="background: \${color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                        \${marker.urgency.toUpperCase()}
                                    </span>
                                    <span style="background: #f0f0f0; color: #666; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                                        \${marker.type.toUpperCase()}
                                    </span>
                                    \${marker.paymentType ? \`<span style="background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                        \${marker.paymentType.toUpperCase()}
                                    </span>\` : ''}
                                </div>
                                \${marker.amount && marker.paymentType !== 'Volunteer' ? \`
                                    <div style="margin-top: 8px; padding: 6px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid \${color};">
                                        <strong style="color: #28a745;">$\${marker.amount}</strong>
                                    </div>
                                \` : ''}
                            </div>
                        \`)
                        .addTo(markersLayer);
                });
            }
            
            function getMarkerColor(urgency, paymentType) {
                // Primary colors based on payment type
                const baseColors = {
                    'volunteer': '#4a8a28',  // Green for volunteer
                    'paid': '#3b82f6',       // Blue for paid
                    'sponsor': '#8b5cf6',    // Purple for sponsor
                };

                const baseColor = baseColors[paymentType?.toLowerCase()] || baseColors['volunteer'];

                // For urgent items, use red regardless of type
                if (urgency?.toLowerCase() === 'urgent') {
                    return '#ff4757'; // Red for urgent missions
                }

                return baseColor;
            }
            
            function getMarkerIcon(type) {
                switch(type) {
                    case 'volunteer': return '♥';
                    case 'paid': return '$';
                    case 'sponsor': return '★';
                    default: return '📍';
                }
            }
            
            // Listen for messages from React Native
            window.addEventListener('message', function(event) {
                const data = JSON.parse(event.data);
                
                if (data.type === 'centerMap') {
                    map.setView([data.latitude, data.longitude], 15);
                } else if (data.type === 'updateMarkers') {
                    markersLayer.clearLayers();
                    data.markers.forEach(marker => {
                        const color = getMarkerColor(marker.urgency);
                        const icon = getMarkerIcon(marker.type);
                        
                        const customIcon = L.divIcon({
                            html: \`<div style="
                                background-color: \${color};
                                width: 30px;
                                height: 30px;
                                border-radius: 50%;
                                border: 3px solid white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: bold;
                                font-size: 14px;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            ">\${icon}</div>\`,
                            className: 'custom-marker',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        });
                        
                        L.marker([marker.latitude, marker.longitude], { icon: customIcon })
                            .bindPopup(\`
                                <div style="font-family: Arial, sans-serif;">
                                    <h3 style="margin: 0 0 8px 0; color: #333;">\${marker.title}</h3>
                                    <p style="margin: 0 0 8px 0; color: #666;">\${marker.description}</p>
                                    <div style="display: flex; gap: 8px;">
                                        <span style="background: \${color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                            \${marker.urgency.toUpperCase()}
                                        </span>
                                        <span style="background: #f0f0f0; color: #666; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                                            \${marker.type.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            \`)
                            .addTo(markersLayer);
                    });
                }
            });
            
            // Initialize map when page loads
            initMap();
        </script>
    </body>
    </html>
  `;
};