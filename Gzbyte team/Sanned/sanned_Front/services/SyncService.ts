import NetInfo from '@react-native-community/netinfo';
import { database } from '~/database';
import { Q } from '@nozbe/watermelondb';

export interface ServerMission {
  id: string;
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
  skills?: string[];
  imageUri?: string;
  bgImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  location?: string;
  isInGaza: boolean;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

class SyncService {
  private isOnline: boolean = false;
  private syncInProgress: boolean = false;
  private serverUrl: string = 'https://your-server-api.com'; // Replace with your server URL

  constructor() {
    this.initializeNetworkListener();
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // If we just came online and weren't syncing, trigger sync
      if (wasOffline && this.isOnline && !this.syncInProgress) {
        this.performFullSync();
      }
    });
  }

  async performFullSync(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    console.log('🔄 Starting full sync...');

    try {
      // Push local changes first
      await this.pushLocalChanges();
      
      // Then pull server updates
      await this.pullServerUpdates();
      
      console.log('✅ Full sync completed successfully');
    } catch (error) {
      console.error('❌ Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async pushLocalChanges(): Promise<void> {
    console.log('⬆️ Pushing local changes...');
    
    // Push new/updated users
    await this.pushUsers();
    
    // Push new/updated missions
    await this.pushMissions();
  }

  private async pushUsers(): Promise<void> {
    const usersCollection = database.get('users');
    const usersNeedingSync = await usersCollection
      .query(Q.where('needs_sync', true), Q.where('is_deleted', false))
      .fetch();

    for (const userModel of usersNeedingSync) {
      const user = userModel as any; // Cast to access properties
      
      try {
        const userData = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
          isInGaza: user.isInGaza,
          bio: user.bio,
          avatar: user.avatar,
          isVerified: user.isVerified,
        };

        let serverResponse;
        if (user.serverId) {
          // Update existing user
          serverResponse = await this.apiCall('PUT', `/users/${user.serverId}`, userData);
        } else {
          // Create new user
          serverResponse = await this.apiCall('POST', '/users', userData);
        }

        // Update local record with server info
        await database.write(async () => {
          await user.update((u: any) => {
            u.serverId = serverResponse.id;
            u.lastSyncAt = Date.now();
            u.needsSync = false;
          });
        });

        console.log(`✅ Synced user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to sync user ${user.email}:`, error);
      }
    }
  }

  private async pushMissions(): Promise<void> {
    const myMissionsCollection = database.get('my_missions');
    const missionsNeedingSync = await myMissionsCollection
      .query(Q.where('needs_sync', true), Q.where('is_deleted', false))
      .fetch();

    for (const missionModel of missionsNeedingSync) {
      const mission = missionModel as any; // Cast to access properties
      
      try {
        const missionData = {
          userId: mission.userId,
          title: mission.title,
          description: mission.description,
          location: mission.location,
          coordinates: mission.coordinates ? JSON.parse(mission.coordinates) : null,
          paymentType: mission.paymentType,
          amount: mission.amount,
          urgency: mission.urgency,
          status: mission.status,
          skills: mission.skills ? JSON.parse(mission.skills) : null,
          imageUri: mission.imageUri,
          bgImage: mission.bgImage,
        };

        let serverResponse;
        if (mission.serverId) {
          // Update existing mission
          serverResponse = await this.apiCall('PUT', `/missions/${mission.serverId}`, missionData);
        } else {
          // Create new mission
          serverResponse = await this.apiCall('POST', '/missions', missionData);
        }

        // Update local record with server info
        await database.write(async () => {
          await mission.update((m: any) => {
            m.serverId = serverResponse.id;
            m.lastSyncAt = Date.now();
            m.needsSync = false;
          });
        });

        console.log(`✅ Synced mission: ${mission.title}`);
      } catch (error) {
        console.error(`❌ Failed to sync mission ${mission.title}:`, error);
      }
    }
  }

  private async pullServerUpdates(): Promise<void> {
    console.log('⬇️ Pulling server updates...');
    
    // Get last sync timestamp
    const lastSyncAt = await this.getLastSyncTimestamp();
    
    // Pull updated missions from server
    await this.pullGlobalMissions(lastSyncAt);
    
    // Update sync timestamp
    await this.updateLastSyncTimestamp();
  }

  private async pullGlobalMissions(since?: number): Promise<void> {
    try {
      const url = since ? `/missions?since=${since}` : '/missions';
      const serverMissions: ServerMission[] = await this.apiCall('GET', url);
      
      const globalMissionsCollection = database.get('global_missions');
      
      await database.write(async () => {
        for (const serverMission of serverMissions) {
          // Check if mission already exists locally
          const existingMissions = await globalMissionsCollection
            .query(Q.where('server_id', serverMission.id))
            .fetch();

          if (existingMissions.length > 0) {
            // Update existing mission
            const existingMission = existingMissions[0];
            await existingMission.update((m: any) => {
              m.userId = serverMission.userId;
              m.userName = serverMission.userName;
              m.userAvatar = serverMission.userAvatar;
              m.title = serverMission.title;
              m.description = serverMission.description;
              m.location = serverMission.location;
              m.coordinates = serverMission.coordinates ? JSON.stringify(serverMission.coordinates) : null;
              m.paymentType = serverMission.paymentType;
              m.amount = serverMission.amount;
              m.urgency = serverMission.urgency;
              m.status = serverMission.status;
              m.skills = serverMission.skills ? JSON.stringify(serverMission.skills) : null;
              m.imageUri = serverMission.imageUri;
              m.bgImage = serverMission.bgImage;
              m.updatedAt = new Date(serverMission.updatedAt).getTime();
              m.lastSyncAt = Date.now();
            });
          } else {
            // Create new mission
            await globalMissionsCollection.create((m: any) => {
              m.serverId = serverMission.id;
              m.userId = serverMission.userId;
              m.userName = serverMission.userName;
              m.userAvatar = serverMission.userAvatar;
              m.title = serverMission.title;
              m.description = serverMission.description;
              m.location = serverMission.location;
              m.coordinates = serverMission.coordinates ? JSON.stringify(serverMission.coordinates) : null;
              m.paymentType = serverMission.paymentType;
              m.amount = serverMission.amount;
              m.urgency = serverMission.urgency;
              m.status = serverMission.status;
              m.skills = serverMission.skills ? JSON.stringify(serverMission.skills) : null;
              m.imageUri = serverMission.imageUri;
              m.bgImage = serverMission.bgImage;
              m.createdAt = new Date(serverMission.createdAt).getTime();
              m.updatedAt = new Date(serverMission.updatedAt).getTime();
              m.lastSyncAt = Date.now();
            });
          }
        }
      });

      console.log(`✅ Synced ${serverMissions.length} global missions`);
    } catch (error) {
      console.error('❌ Failed to pull global missions:', error);
    }
  }

  private async getLastSyncTimestamp(): Promise<number> {
    // You could store this in AsyncStorage or a settings table
    // For now, return 0 to sync all data
    return 0;
  }

  private async updateLastSyncTimestamp(): Promise<void> {
    // Store current timestamp as last sync time
    // Implementation depends on your storage preference
  }

  private async apiCall(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.serverUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers here if needed
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Public methods for manual sync triggers
  async syncNow(): Promise<void> {
    if (this.isOnline) {
      await this.performFullSync();
    } else {
      console.log('📱 Device is offline, sync will happen when online');
    }
  }

  getNetworkStatus(): boolean {
    return this.isOnline;
  }

  isSyncInProgress(): boolean {
    return this.syncInProgress;
  }
}

// Export singleton instance
export const syncService = new SyncService();