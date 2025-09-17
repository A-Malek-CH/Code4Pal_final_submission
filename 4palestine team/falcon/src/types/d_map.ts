export interface MarkerType {
	id: string;
	lat: number;
	long: number;
	type: 'food' | 'water' | 'danger' | 'aid';
	description: string;
	image?: string;
	user_id: string;
	last_updated: Date;
	reports: number;
}

export interface MapMarker {
	id: number;
	position: LatLngExpression;
	label: string;
}

export interface MapClickHandlerProps {
	onMapClick: (lat: number, lng: number) => void;
}

export interface MapInitializerProps {
	mapRef: React.MutableRefObject<L.Map | null>;
	pins?: MarkerType[];
}

export type LatLngExpression = L.LatLngExpression;

export function markerToMap(markers: MarkerType[]): MapMarker[] {
	return markers.map(marker => ({
		id: parseInt(marker.id, 10),
		position: [marker.lat, marker.long],
		label: marker.description,
	}));
}