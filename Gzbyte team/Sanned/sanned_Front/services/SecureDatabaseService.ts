// Secure Database Service
// Provides parameterized queries and additional security layers for database operations

import { database } from '~/database';
import { Q, Model } from '@nozbe/watermelondb';
import { sanitizeInput } from '~/utils/security';

export class SecureDatabaseService {
  // Secure user queries
  static async findUserByEmail(email: string): Promise<any | null> {
    try {
      // Validate and sanitize email
      if (!email || typeof email !== 'string') {
        throw new Error('Invalid email parameter');
      }
      
      const cleanEmail = email.toLowerCase().trim();
      
      // Use parameterized query through WatermelonDB
      const users = await database.get('users')
        .query(Q.where('email', cleanEmail))
        .fetch();
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Database query failed');
    }
  }

  // Secure mission queries
  static async findMissionById(missionId: string): Promise<any | null> {
    try {
      // Validate mission ID
      if (!missionId || typeof missionId !== 'string') {
        throw new Error('Invalid mission ID parameter');
      }
      
      // Sanitize the ID to prevent injection
      const cleanId = sanitizeInput(missionId);
      
      const mission = await database.get('my_missions').find(cleanId);
      return mission;
    } catch (error) {
      console.error('Error finding mission:', error);
      return null;
    }
  }

  // Secure mission search with filters
  static async searchMissions(filters: {
    status?: string;
    urgency?: string;
    paymentType?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      const { status, urgency, paymentType, limit = 50 } = filters;
      
      // Validate and sanitize filters
      const queries = [];
      
      if (status && ['active', 'matched', 'completed', 'cancelled'].includes(status)) {
        queries.push(Q.where('status', status));
      }
      
      if (urgency && ['Urgent', 'Soon', 'Flexible'].includes(urgency)) {
        queries.push(Q.where('urgency', urgency));
      }
      
      if (paymentType && ['Volunteer', 'Paid', 'Sponsor'].includes(paymentType)) {
        queries.push(Q.where('payment_type', paymentType));
      }
      
      // Limit results to prevent resource exhaustion
      if (limit > 100) {
        throw new Error('Limit cannot exceed 100');
      }
      
      queries.push(Q.take(limit));
      
      const missions = await database.get('my_missions')
        .query(...queries)
        .fetch();
      
      return missions;
    } catch (error) {
      console.error('Error searching missions:', error);
      throw new Error('Mission search failed');
    }
  }

  // Secure user skills query
  static async getUserSkills(userId: string): Promise<string[]> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID parameter');
      }
      
      const cleanUserId = sanitizeInput(userId);
      
      const skills = await database.get('user_skills')
        .query(Q.where('user_id', cleanUserId))
        .fetch();
      
      return skills.map((skill: any) => skill.skill).filter(Boolean);
    } catch (error) {
      console.error('Error fetching user skills:', error);
      return [];
    }
  }

  // Secure user creation
  static async createUser(userData: {
    id: string;
    name: string;
    email: string;
    location: string;
    bio?: string;
    phone?: string;
    avatar?: string;
    isVerified?: boolean;
    role?: string;
    isInGaza?: boolean;
  }): Promise<any> {
    try {
      // Validate required fields
      if (!userData.id || !userData.name || !userData.email || !userData.location) {
        throw new Error('Missing required user data');
      }
      
      // Validate data types and lengths
      if (userData.name.length > 50 || userData.email.length > 100 || userData.location.length > 100) {
        throw new Error('User data exceeds maximum length');
      }
      
      if (userData.bio && userData.bio.length > 200) {
        throw new Error('Bio exceeds maximum length');
      }
      
      // Sanitize all string inputs
      const cleanUserData = {
        id: sanitizeInput(userData.id),
        name: sanitizeInput(userData.name),
        email: userData.email.toLowerCase().trim(),
        location: sanitizeInput(userData.location),
        bio: userData.bio ? sanitizeInput(userData.bio) : '',
        phone: userData.phone ? sanitizeInput(userData.phone) : '',
        avatar: userData.avatar || '',
        isVerified: Boolean(userData.isVerified),
        role: userData.role || 'doer',
        isInGaza: Boolean(userData.isInGaza),
      };
      
      return await database.write(async () => {
        return await database.get('users').create((user: any) => {
          user.id = cleanUserData.id;
          user.name = cleanUserData.name;
          user.email = cleanUserData.email;
          user.location = cleanUserData.location;
          user.bio = cleanUserData.bio;
          user.phone = cleanUserData.phone;
          user.avatar = cleanUserData.avatar;
          user.isVerified = cleanUserData.isVerified;
          user.role = cleanUserData.role;
          user.isInGaza = cleanUserData.isInGaza;
          user.createdAt = new Date();
          user.updatedAt = new Date();
        });
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User creation failed');
    }
  }

  // Secure mission creation
  static async createMission(missionData: {
    id?: string;
    userId: string;
    title: string;
    description: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    paymentType: string;
    amount?: number;
    urgency: string;
    status?: string;
    skills?: string[];
    imageUri?: string;
  }): Promise<any> {
    try {
      // Validate required fields
      if (!missionData.userId || !missionData.title || !missionData.description) {
        throw new Error('Missing required mission data');
      }
      
      // Validate data constraints
      if (missionData.title.length > 100 || missionData.description.length > 500) {
        throw new Error('Mission data exceeds maximum length');
      }
      
      if (missionData.amount && (missionData.amount < 0 || missionData.amount > 10000)) {
        throw new Error('Invalid mission amount');
      }
      
      // Validate enum values
      if (!['Volunteer', 'Paid', 'Sponsor'].includes(missionData.paymentType)) {
        throw new Error('Invalid payment type');
      }
      
      if (!['Urgent', 'Soon', 'Flexible'].includes(missionData.urgency)) {
        throw new Error('Invalid urgency level');
      }
      
      // Sanitize inputs
      const cleanMissionData = {
        id: missionData.id || `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: sanitizeInput(missionData.userId),
        title: sanitizeInput(missionData.title),
        description: sanitizeInput(missionData.description),
        location: missionData.location ? sanitizeInput(missionData.location) : '',
        latitude: missionData.latitude || 0,
        longitude: missionData.longitude || 0,
        paymentType: missionData.paymentType,
        amount: missionData.amount || 0,
        urgency: missionData.urgency,
        status: missionData.status || 'active',
        skills: missionData.skills ? JSON.stringify(missionData.skills.map(sanitizeInput)) : '[]',
        imageUri: missionData.imageUri || '',
      };
      
      return await database.write(async () => {
        return await database.get('my_missions').create((mission: any) => {
          mission.id = cleanMissionData.id;
          mission.userId = cleanMissionData.userId;
          mission.title = cleanMissionData.title;
          mission.description = cleanMissionData.description;
          mission.location = cleanMissionData.location;
          mission.latitude = cleanMissionData.latitude;
          mission.longitude = cleanMissionData.longitude;
          mission.paymentType = cleanMissionData.paymentType;
          mission.amount = cleanMissionData.amount;
          mission.urgency = cleanMissionData.urgency;
          mission.status = cleanMissionData.status;
          mission.skills = cleanMissionData.skills;
          mission.imageUri = cleanMissionData.imageUri;
          mission.createdAt = new Date();
          mission.updatedAt = new Date();
        });
      });
    } catch (error) {
      console.error('Error creating mission:', error);
      throw new Error('Mission creation failed');
    }
  }

  // Secure mission update
  static async updateMissionStatus(missionId: string, status: string): Promise<void> {
    try {
      if (!missionId || !status) {
        throw new Error('Missing required parameters');
      }
      
      // Validate status value
      if (!['active', 'matched', 'completed', 'cancelled'].includes(status)) {
        throw new Error('Invalid status value');
      }
      
      const cleanMissionId = sanitizeInput(missionId);
      
      await database.write(async () => {
        const mission = await database.get('my_missions').find(cleanMissionId);
        await mission.update((m: any) => {
          m.status = status;
          m.updatedAt = new Date();
        });
      });
    } catch (error) {
      console.error('Error updating mission status:', error);
      throw new Error('Mission status update failed');
    }
  }

  // Secure data cleanup (remove old/expired data)
  static async cleanupOldData(daysOld: number = 90): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      await database.write(async () => {
        // Clean up old completed missions
        const oldMissions = await database.get('my_missions')
          .query(
            Q.where('status', 'completed'),
            Q.where('updated_at', Q.lt(cutoffDate.getTime()))
          )
          .fetch();
        
        for (const mission of oldMissions) {
          await mission.destroyPermanently();
        }
        
        // Clean up old notifications
        const oldNotifications = await database.get('notifications')
          .query(Q.where('created_at', Q.lt(cutoffDate.getTime())))
          .fetch();
        
        for (const notification of oldNotifications) {
          await notification.destroyPermanently();
        }
      });
      
      console.log(`Cleaned up data older than ${daysOld} days`);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  // Database health check
  static async performHealthCheck(): Promise<{ healthy: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Test basic database connectivity
      await database.get('users').query(Q.take(1)).fetch();
      
      // Check for data integrity issues
      const missions = await database.get('my_missions').query(Q.take(10)).fetch();
      const users = await database.get('users').query(Q.take(10)).fetch();
      
      // Validate data structure
      missions.forEach((mission: any, index) => {
        if (!mission.title || !mission.description) {
          errors.push(`Mission ${index} has invalid data structure`);
        }
      });
      
      users.forEach((user: any, index) => {
        if (!user.email || !user.name) {
          errors.push(`User ${index} has invalid data structure`);
        }
      });
      
      return {
        healthy: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push(`Database connectivity error: ${error}`);
      return {
        healthy: false,
        errors
      };
    }
  }
}

export default SecureDatabaseService;