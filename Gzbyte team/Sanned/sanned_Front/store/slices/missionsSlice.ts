import { StateCreator } from 'zustand';
import { database } from '~/database';
import { Request as DBRequest, Match as DBMatch, MyMission, GlobalMission } from '~/database/models';
import { Q } from '@nozbe/watermelondb';
import { AppStore, MissionsState, MissionsActions, MissionItem, MatchItem, GlobalMissionItem } from '../types';
import { syncService } from '~/services/SyncService';

export interface MissionsSlice extends MissionsState, MissionsActions {}

export const createMissionsSlice: StateCreator<
  AppStore,
  [],
  [],
  MissionsSlice
> = (set, get) => ({
  // Initial state
  missions: [],
  globalMissions: [],
  userMatches: [],
  lastSyncTimestamp: 0,
  isSyncing: false,

  // Actions
  loadMissions: async (userId?: string) => {
    try {
      let missions;
      if (userId) {
        // Load missions for specific user
        missions = await database.get<MyMission>('my_missions')
          .query(Q.where('user_id', userId))
          .fetch();
      } else {
        // Load all available missions (active status)
        missions = await database.get<MyMission>('my_missions')
          .query(Q.where('status', Q.oneOf(['active', 'matched'])))
          .fetch();
      }

      const missionItems = missions.map(mission => ({
        id: mission.id,
        userId: mission.userId,
        type: 'service', // Default type for MyMission
        title: mission.title,
        description: mission.description || '',
        location: mission.location || '',
        status: mission.status || 'open',
        createdAt: mission.createdAt,
        // Additional fields from MyMission
        paymentType: mission.paymentType,
        amount: mission.amount,
        urgency: mission.urgency,
        skills: mission.skillsArray,
        coordinates: mission.coordinatesObject || undefined,
        bgimage: mission.bgImage,
        // UI fields
        reward: mission.amount || 0,
        skillsRequired: mission.skillsArray || [],
        creatorId: mission.userId,
        isBookmarked: false,
        // Add profile image path for UI
        profile: require('~/assets/images/pfp.jpeg'),
        name: `user_${mission.userId.slice(-4)}` // Temporary name until we get user info
      }));

      set({ missions: missionItems });
    } catch (error) {
      console.error('Failed to load missions:', error);
      throw error;
    }
  },

  loadUserMatches: async (userId: string) => {
    try {
      const matches = await database.get<DBMatch>('matches')
        .query(Q.where('matched_with_id', userId))
        .fetch();

      const matchItems = await Promise.all(matches.map(async match => {
        const request = await match.request;
        return {
          id: match.id,
          requestId: match.requestId,
          matchedWithId: match.matchedWithId,
          status: match.status || 'pending',
          createdAt: match.createdAt,
          mission: {
            id: request.id,
            title: request.title,
            description: request.description || '',
            location: request.location || '',
            reward: 0 // Default value as reward is not in current schema
          }
        };
      }));

      set({ userMatches: matchItems });
    } catch (error) {
      console.error('Failed to load user matches:', error);
      throw error;
    }
  },

  loadGlobalMissions: async () => {
    try {
      const globalMissions = await database.get<GlobalMission>('global_missions')
        .query(Q.where('status', 'active'))
        .fetch();

      const globalMissionItems: GlobalMissionItem[] = globalMissions.map(mission => ({
        id: mission.id,
        serverId: mission.serverId,
        userId: mission.userId,
        userName: mission.userName,
        userAvatar: mission.userAvatar,
        title: mission.title,
        description: mission.description,
        location: mission.location || 'Location not specified',
        coordinates: mission.coordinatesObject || undefined,
        paymentType: mission.paymentType,
        amount: mission.amount,
        urgency: mission.urgency,
        status: mission.status,
        skills: mission.skillsArray,
        imageUri: mission.imageUri,
        bgImage: mission.bgImage,
        distanceKm: mission.distanceKm,
        createdAt: mission.createdAt,
        updatedAt: mission.updatedAt,
        lastSyncAt: new Date(mission.lastSyncAt)
      }));

      set({ globalMissions: globalMissionItems });
    } catch (error) {
      console.error('Failed to load global missions:', error);
      throw error;
    }
  },

  syncMissions: async () => {
    try {
      set({ isSyncing: true });
      
      // Trigger sync service
      await syncService.syncNow();
      
      // Reload global missions after sync
      await get().loadGlobalMissions();
      
      // Update sync timestamp
      set({ 
        lastSyncTimestamp: Date.now(),
        isSyncing: false 
      });
    } catch (error) {
      console.error('Failed to sync missions:', error);
      set({ isSyncing: false });
      throw error;
    }
  },

  createMission: async (missionData: Omit<MissionItem, 'id' | 'createdAt' | 'status'>) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      // Create in database using MyMission
      const newMission = await database.write(async () => {
        return await database.get<MyMission>('my_missions').create(mission => {
          mission.userId = user.id;
          mission.title = missionData.title;
          mission.description = missionData.description || '';
          mission.location = missionData.location || '';
          // Set coordinates - prefer coordinate object, fallback to separate fields if available
          if (missionData.coordinates) {
            mission.latitude = missionData.coordinates.latitude;
            mission.longitude = missionData.coordinates.longitude;
          } else {
            // Default to Gaza City coordinates if no coordinates provided
            mission.latitude = 31.5017;
            mission.longitude = 34.4668;
          }
          mission.paymentType = missionData.paymentType || 'Volunteer';
          mission.amount = missionData.amount || 0;
          mission.urgency = missionData.urgency || 'Flexible';
          mission.status = 'active';
          mission.imageUri = missionData.image;
          mission.bgImage = 'tent'; // Default background
          
          // Sync fields
          mission.needsSync = true;
          mission.isDeleted = false;
          
          // Handle skills
          if (missionData.skills && missionData.skills.length > 0) {
            mission.skills = JSON.stringify(missionData.skills);
          }
          
          // Handle amount if it's a paid mission
          if (missionData.paymentType === 'Paid' && missionData.reward) {
            mission.amount = missionData.reward;
          }
        });
      });

      // Update local state
      set(state => ({
        missions: [{
          id: newMission.id,
          userId: newMission.userId,
          type: 'service',
          title: newMission.title,
          description: newMission.description || '',
          location: newMission.location || '',
          status: newMission.status,
          createdAt: newMission.createdAt,
          paymentType: newMission.paymentType,
          urgency: newMission.urgency,
          amount: newMission.amount,
          skills: newMission.skillsArray,
          coordinates: newMission.coordinatesObject || undefined,
          bgimage: newMission.bgImage,
          // UI fields
          reward: newMission.amount || 0,
          skillsRequired: newMission.skillsArray || [],
          creatorId: user.id,
          isBookmarked: false,
          profile: require('~/assets/images/pfp.jpeg'),
          name: `user_${user.id.slice(-4)}`
        }, ...state.missions]
      }));
    } catch (error) {
      console.error('Failed to create mission:', error);
      throw error;
    }
  },

  updateMissionStatus: async (missionId: string, status: string) => {
    try {
      // Update in database
      await database.write(async () => {
        const mission = await database.get<MyMission>('my_missions').find(missionId);
        await mission.update(m => {
          m.status = status;
          m.updatedAt = new Date();
        });
      });

      // Update local state
      set(state => ({
        missions: state.missions.map(mission =>
          mission.id === missionId ? { ...mission, status } : mission
        ),
        userMatches: state.userMatches.map(match =>
          match.requestId === missionId ? { ...match, status } : match
        )
      }));
    } catch (error) {
      console.error('Failed to update mission status:', error);
      throw error;
    }
  },

  joinMission: async (missionId: string) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      // First, check if this is a global mission or user mission
      let mission: MyMission | GlobalMission | null = null;
      let isGlobalMission = false;

      try {
        // Try to find in my_missions first
        mission = await database.get<MyMission>('my_missions').find(missionId);
      } catch {
        // If not found in my_missions, try global_missions
        try {
          mission = await database.get<GlobalMission>('global_missions').find(missionId);
          isGlobalMission = true;
        } catch {
          throw new Error(`Mission with ID ${missionId} not found`);
        }
      }

      if (!mission) {
        throw new Error(`Mission with ID ${missionId} not found`);
      }

      // For global missions, we create a local match record but don't update the global mission
      if (isGlobalMission) {
        // Create a match record to track this user's participation
        await database.write(async () => {
          await database.get<DBMatch>('matches').create((match) => {
            match.requestId = missionId;
            match.matchedWithId = user.id;
            match.status = 'matched';
          });
        });
      } else {
        // For user missions, update the mission status
        await database.write(async () => {
          await (mission as MyMission).update(m => {
            m.status = 'matched';
            m.updatedAt = new Date();
          });
        });
      }

      // Update local state - add to user matches
      set(state => ({
        // For global missions, we don't remove them from the global missions list
        // For user missions, we remove them from available missions
        missions: isGlobalMission ? state.missions : state.missions.filter(m => m.id !== missionId),
        userMatches: [{
          id: `match_${missionId}_${user.id}`,
          requestId: missionId,
          matchedWithId: user.id,
          status: 'matched',
          createdAt: new Date(),
          mission: {
            id: mission.id,
            title: mission.title,
            description: mission.description || '',
            location: mission.location || '',
            reward: mission.amount || 0
          }
        }, ...state.userMatches]
      }));
    } catch (error) {
      console.error('Failed to join mission:', error);
      throw error;
    }
  },

  bookmarkMission: async (missionId: string) => {
    try {
      // For now, just update local state
      // In a full implementation, this would create a bookmark record in the database
      set(state => ({
        missions: state.missions.map(mission =>
          mission.id === missionId ? { ...mission, isBookmarked: !mission.isBookmarked } : mission
        )
      }));
    } catch (error) {
      console.error('Failed to bookmark mission:', error);
      throw error;
    }
  },

  clearMissions: () => set({ missions: [], userMatches: [] }),
});