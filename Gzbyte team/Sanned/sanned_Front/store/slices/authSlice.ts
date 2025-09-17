import { StateCreator } from 'zustand';
import { database } from '~/database';
import { User as DBUser } from '~/database/models';
import { AppStore, AuthState, AuthActions, User } from '../types';
import { AuthenticationSecurity } from '~/services/AuthenticationSecurity';
import { SecureDatabaseService } from '~/services/SecureDatabaseService';

export interface AuthSlice extends AuthState, AuthActions {}

export const createAuthSlice: StateCreator<
  AppStore,
  [],
  [],
  AuthSlice
> = (set, get) => ({
  // Initial state
  hasCompletedOnboarding: false,
  isAuthenticated: false,
  user: null,
  authToken: null,
  
  // Actions
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  
  // Load user from database (useful for app initialization)
  loadUserFromDatabase: async () => {
    try {
      console.log('Loading user from database...');
      const users = await database.get<DBUser>('users').query().fetch();
      
      if (users.length > 0) {
        const dbUser = users[0] as any; // Use the first user for now
        const user: User = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          avatar: dbUser.avatar,
          isVerified: dbUser.isVerified,
          role: dbUser.role,
          location: dbUser.location,
          bio: dbUser.bio,
          phone: dbUser.phone,
          isInGaza: dbUser.isInGaza,
        };
        
        console.log('Loaded user from database:', user);
        
        set({
          user,
          isAuthenticated: true,
          hasCompletedOnboarding: true,
        });
        
        // Load user data
        const { loadNotifications, loadUserSkills, loadMissions, loadUserMatches } = get();
        await Promise.all([
          loadNotifications(user.id),
          loadUserSkills(user.id),
          loadMissions(user.id),
          loadUserMatches(user.id)
        ]);
        
        return user;
      } else {
        console.log('No users found in database');
        return null;
      }
    } catch (error) {
      console.error('Failed to load user from database:', error);
      throw error;
    }
  },  login: async (user: User, token: string) => {
    set({ 
      isAuthenticated: true, 
      user, 
      authToken: token 
    });
    
    // Load user data from database
    const { loadNotifications, loadUserSkills, loadMissions, loadUserMatches } = get();
    await Promise.all([
      loadNotifications(user.id),
      loadUserSkills(user.id),
      loadMissions(user.id),
      loadUserMatches(user.id)
    ]);
  },
  
  logout: () => {
    const { clearNotifications, clearSkills, clearMissions } = get();
    
    // Clear all user data
    clearNotifications();
    clearSkills();
    clearMissions();
    
    set({ 
      isAuthenticated: false, 
      user: null, 
      authToken: null
    });
  },
  
  updateUser: async (userData: Partial<User>) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');
      
      console.log('Updating user profile:', { userId: user.id, userData });
      
      // First check if user exists in database
      const existingUsers = await database.get<DBUser>('users')
        .query()
        .fetch();
      
      console.log('All users in database:', existingUsers.map(u => ({ id: u.id, name: u.name })));
      
      const dbUser = existingUsers.find(u => u.id === user.id);
      
      if (!dbUser) {
        console.error('User not found in database, creating new user...');
        
        // Create new user in database
        await database.write(async () => {
          const newUser = await database.get<DBUser>('users').create((u: any) => {
            u.name = user.name;
            u.email = user.email;
            u.phone = user.phone || '';
            u.passwordHash = ''; // We'll need to handle this properly later
            u.role = user.role;
            u.location = user.location || '';
            u.isInGaza = user.isInGaza || false;
            u.bio = user.bio || '';
            u.avatar = user.avatar || '';
            u.isVerified = user.isVerified || false;
            u.serverId = ''; // Will be set when synced to server
            u.lastSyncAt = 0;
            u.isDeleted = false;
            u.needsSync = true;
            // Don't set createdAt and updatedAt - WatermelonDB handles these automatically
          });
          
          console.log('Created new user in database:', newUser.id);
          
          // Update the user ID in state to match the database
          set(state => ({
            user: state.user ? { ...state.user, id: newUser.id } : null
          }));
        });
      } else {
        // Update existing user in database
        await database.write(async () => {
          await dbUser.update((u: any) => {
            console.log('Updating database user fields...');
            if (userData.name !== undefined) {
              console.log('Updating name:', userData.name);
              u.name = userData.name;
            }
            if (userData.email !== undefined) {
              console.log('Updating email:', userData.email);
              u.email = userData.email;
            }
            if (userData.bio !== undefined) {
              console.log('Updating bio:', userData.bio);
              u.bio = userData.bio || '';
            }
            if (userData.location !== undefined) {
              console.log('Updating location:', userData.location);
              u.location = userData.location || '';
            }
            if (userData.phone !== undefined) {
              console.log('Updating phone:', userData.phone);
              u.phone = userData.phone || '';
            }
            if (userData.avatar !== undefined) {
              console.log('Updating avatar:', userData.avatar);
              u.avatar = userData.avatar || '';
            }
            
            // Mark as needing sync
            u.needsSync = true;
            // Don't set updatedAt - WatermelonDB handles this automatically
          });
        });
      }
      
      console.log('Database update completed, updating local state...');
      
      // Update local state
      set(state => ({
        user: state.user ? { ...state.user, ...userData } : null
      }));
      
      console.log('Profile update completed successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  // Alias for updateUser for convenience
  updateUserProfile: async (userData: Partial<User>) => {
    const { updateUser } = get();
    return updateUser(userData);
  },
  
  resetAuth: () => set({
    hasCompletedOnboarding: false,
    isAuthenticated: false,
    user: null,
    authToken: null,
  }),
});