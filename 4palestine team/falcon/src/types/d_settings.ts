export type Settings = {
  general: {
    orgName: string;
    supportEmail: string;
    timezone: string;
    language: string;
  };
  map: {
    style: "streets" | "satellite" | "dark" | "light";
    defaultZoom: number;
    showMarkers: boolean;
    showSOS: boolean;
    centerLat: string;
    centerLng: string;
  };
  notifications: {
    emailRequests: boolean;
    emailUsers: boolean;
    emailLocations: boolean;
    pushEnabled: boolean;
    digest: "off" | "daily" | "weekly";
  };
  appearance: {
    theme: "system" | "light" | "dark";
    density: "comfortable" | "compact";
    collapseSidebarOnMobile: boolean;
  };
  privacy: {
    shareLocation: boolean;
    anonymizeMarkers: boolean;
    dataRetentionDays: number;
  };
};