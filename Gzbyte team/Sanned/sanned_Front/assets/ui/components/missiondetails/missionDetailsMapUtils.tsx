// assets/ui/components/missiondetails/missionDetailsMapUtils.js

export const createMiniMapHTML = (coordinates, location) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
      <style>
        html, body, #map {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
        .custom-marker {
          background-color: #dc2626;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', {
          center: [${coordinates.latitude}, ${coordinates.longitude}],
          zoom: 14,
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          dragging: false,
          touchZoom: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const customIcon = L.divIcon({
          html: '<div class="custom-marker">📍</div>',
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        L.marker([${coordinates.latitude}, ${coordinates.longitude}], { 
          icon: customIcon 
        })
        .bindPopup(\`
          <div style="font-family: Arial, sans-serif; text-align: center;">
            <h4 style="margin: 0 0 8px 0; color: #333;">Mission Location</h4>
            <p style="margin: 0; color: #666; font-size: 12px;">${location}</p>
          </div>
        \`)
        .addTo(map);

        map.on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'openFullMap',
            coordinates: [${coordinates.latitude}, ${coordinates.longitude}]
          }));
        });
      </script>
    </body>
    </html>
  `;
};