// assets/ui/components/map/MapContainer.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import MapControls from './MapControls';
import MapLegend from './MapLegend';

export default function MapContainer({ 
    webViewRef, 
    mapHTML, 
    onWebViewMessage, 
    onLocationPress, 
    onAddMarkerPress 
}) {
    return (
        <View style={styles.mapContainer}>
            <WebView
                ref={webViewRef}
                source={{ html: mapHTML }}
                style={styles.map}
                onMessage={onWebViewMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
            
            <MapControls 
                onLocationPress={onLocationPress}
                onAddMarkerPress={onAddMarkerPress}
            />
            
            <MapLegend />
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});