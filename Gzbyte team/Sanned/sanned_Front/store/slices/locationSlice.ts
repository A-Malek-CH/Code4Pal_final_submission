import { StateCreator } from 'zustand';
import { AppStore } from '../types';

// Location interface
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: number;
}

export interface LocationSlice {
  // State
  selectedLocation: LocationData | null;
  currentLocation: LocationData | null;
  isLoadingLocation: boolean;
  locationError: string | null;

  // Actions
  setSelectedLocation: (location: LocationData | null) => void;
  setCurrentLocation: (location: LocationData | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  clearLocation: () => void;
}

export const createLocationSlice: StateCreator<
  AppStore,
  [],
  [],
  LocationSlice
> = (set, get) => ({
  // Initial state
  selectedLocation: null,
  currentLocation: null,
  isLoadingLocation: false,
  locationError: null,

  // Actions
  setSelectedLocation: (location) => {
    set({ 
      selectedLocation: location ? {
        ...location,
        timestamp: Date.now()
      } : null,
      locationError: null
    });
  },

  setCurrentLocation: (location) => {
    set({ 
      currentLocation: location ? {
        ...location,
        timestamp: Date.now()
      } : null
    });
  },

  setLocationLoading: (loading) => {
    set({ isLoadingLocation: loading });
  },

  setLocationError: (error) => {
    set({ 
      locationError: error,
      isLoadingLocation: false
    });
  },

  clearLocation: () => {
    set({
      selectedLocation: null,
      currentLocation: null,
      isLoadingLocation: false,
      locationError: null
    });
  },
});