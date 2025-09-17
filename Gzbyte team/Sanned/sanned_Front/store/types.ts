// User interface (enhanced with database fields)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  role?: string; // 'sponsor' | 'seeker' | 'doer'
  location?: string;
  bio?: string;
  phone?: string;
  phoneNumber?: string; // Alias for phone
  isInGaza?: boolean;
  skills?: string[];
  hasCompletedSetup?: boolean;
}

// Notification interface
export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  icon?: string;
  color?: string;
  createdAt: Date;
}

// Skill interface
export interface Skill {
  id: string;
  userId: string;
  skill: string;
}

// Mission interface
export interface MissionItem {
  id: string;
  userId: string;
  type: string; // 'donation' | 'exchange' | 'service'
  title: string;
  description: string;
  location: string;
  status: string; // 'approved' | 'rejected' | 'matched' | 'done'
  paymentType?: string; // 'Volunteer' | 'Paid' | 'Sponsor'
  urgency?: string; // 'Urgent' | 'Soon' | 'Flexible'
  image?: string;
  createdAt: Date;
  // MyMission specific fields
  amount?: number;
  skills?: string[];
  coordinates?: { latitude: number; longitude: number };
  bgimage?: string | any;
  profile?: any;
  name?: string;
  // Additional fields for UI
  reward?: number;
  skillsRequired?: string[];
  creatorId?: string;
  isBookmarked?: boolean;
}

// Global Mission interface (cached from server)
export interface GlobalMissionItem {
  id: string;
  serverId: string; // Server-side ID
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  location: string;
  coordinates?: { latitude: number; longitude: number };
  paymentType: string;
  amount?: number;
  urgency: string;
  status: string;
  skills: string[];
  imageUri?: string;
  bgImage?: string;
  distanceKm?: number;
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt: Date;
}

// Match interface
export interface MatchItem {
  id: string;
  requestId: string;
  matchedWithId: string;
  status: string; // 'initiated' | 'confirmed' | 'cancelled'
  createdAt: Date;
  mission?: {
    id: string;
    title: string;
    description: string;
    location: string;
    reward: number;
  };
}

// Settings interfaces
export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  locationServices: boolean;
  hapticFeedback: boolean;
  autoBackup: boolean;
  analytics: boolean;
  backgroundAppRefresh: boolean;
  twoFactor: boolean;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  missionUpdates: boolean;
  newMessages: boolean;
  achievements: boolean;
  marketing: boolean;
  emailNotifications: boolean;
  inAppSounds: boolean;
}

// Slice interfaces
export interface AuthState {
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  user: User | null;
  authToken: string | null;
}

export interface AuthActions {
  completeOnboarding: () => void;
  loadUserFromDatabase: () => Promise<User | null>;
  login: (user: User, token: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  resetAuth: () => void;
}

export interface NotificationsState {
  notifications: NotificationItem[];
}

export interface NotificationsActions {
  loadNotifications: (userId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  createNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt'>) => Promise<void>;
  clearNotifications: () => void;
}

export interface MissionsState {
  missions: MissionItem[];
  globalMissions: GlobalMissionItem[];
  userMatches: MatchItem[];
  lastSyncTimestamp: number;
  isSyncing: boolean;
}

export interface MissionsActions {
  loadMissions: (userId?: string) => Promise<void>;
  loadGlobalMissions: () => Promise<void>;
  syncMissions: () => Promise<void>;
  loadUserMatches: (userId: string) => Promise<void>;
  createMission: (mission: Omit<MissionItem, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateMissionStatus: (missionId: string, status: string) => Promise<void>;
  joinMission: (missionId: string) => Promise<void>;
  bookmarkMission: (missionId: string) => Promise<void>;
  clearMissions: () => void;
}

export interface SkillsState {
  userSkills: Skill[];
}

export interface SkillsActions {
  loadUserSkills: (userId: string) => Promise<void>;
  addUserSkill: (skill: string) => Promise<void>;
  removeUserSkill: (skillId: string) => Promise<void>;
  clearSkills: () => void;
}

// Location types
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: number;
}

export interface LocationState {
  selectedLocation: LocationData | null;
  currentLocation: LocationData | null;
  isLoadingLocation: boolean;
  locationError: string | null;
}

export interface LocationActions {
  setSelectedLocation: (location: LocationData | null) => void;
  setCurrentLocation: (location: LocationData | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  clearLocation: () => void;
}

export interface SettingsState {
  isOnline: boolean;
  networkType: string | null;
  settings: AppSettings;
  notificationSettings: NotificationSettings;
}

export interface SettingsActions {
  setNetworkStatus: (isOnline: boolean, networkType: string | null) => void;
  updateSettings: (key: keyof AppSettings, value: boolean) => void;
  updateNotificationSettings: (key: keyof NotificationSettings, value: boolean) => void;
  resetSettings: () => void;
}

// Combined store interface
export interface AppStore extends 
  AuthState,
  AuthActions,
  NotificationsState,
  NotificationsActions,
  MissionsState,
  MissionsActions,
  SkillsState,
  SkillsActions,
  LocationState,
  LocationActions,
  SettingsState,
  SettingsActions {
  resetApp: () => void;
}