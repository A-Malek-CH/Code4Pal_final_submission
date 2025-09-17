// Debug utility for profile updates
import { database } from '~/database';
import { User } from '~/database/models';

export const debugUserProfile = async (userId: string) => {
  try {
    console.log('=== DEBUG USER PROFILE ===');
    console.log('Checking user ID:', userId);
    
    // Check if user exists in database
    const users = await database.get<User>('users').query().fetch();
    console.log('All users in database:', users.length);
    
    users.forEach((user: any, index) => {
      console.log(`User ${index + 1}:`, {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        avatar: user.avatar
      });
    });
    
    // Try to find specific user
    try {
      const specificUser = await database.get<User>('users').find(userId);
      console.log('Found specific user:', {
        id: specificUser.id,
        name: (specificUser as any).name,
        email: (specificUser as any).email,
        bio: (specificUser as any).bio,
        location: (specificUser as any).location,
        phone: (specificUser as any).phone,
        avatar: (specificUser as any).avatar
      });
    } catch (findError) {
      console.error('Could not find user with ID:', userId, findError);
    }
    
    console.log('=== END DEBUG ===');
  } catch (error) {
    console.error('Debug error:', error);
  }
};

export const testUserUpdate = async (userId: string, updateData: any) => {
  try {
    console.log('=== TEST USER UPDATE ===');
    console.log('User ID:', userId);
    console.log('Update data:', updateData);
    
    await database.write(async () => {
      const user = await database.get<User>('users').find(userId);
      console.log('Found user for update:', (user as any).name);
      
      await user.update((u: any) => {
        console.log('Before update:', {
          name: u.name,
          email: u.email,
          bio: u.bio,
          location: u.location,
          phone: u.phone,
          avatar: u.avatar
        });
        
        if (updateData.name) u.name = updateData.name;
        if (updateData.email) u.email = updateData.email;
        if (updateData.bio !== undefined) u.bio = updateData.bio;
        if (updateData.location) u.location = updateData.location;
        if (updateData.phone) u.phone = updateData.phone;
        if (updateData.avatar !== undefined) u.avatar = updateData.avatar;
        
        console.log('After update:', {
          name: u.name,
          email: u.email,
          bio: u.bio,
          location: u.location,
          phone: u.phone,
          avatar: u.avatar
        });
      });
    });
    
    console.log('Update completed successfully');
  } catch (error) {
    console.error('Test update failed:', error);
  }
};