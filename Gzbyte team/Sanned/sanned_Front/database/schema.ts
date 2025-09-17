import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 4, // Increment version for coordinate and image field additions
  tables: [
    // Users table
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'password_hash', type: 'string', isOptional: true },
        { name: 'role', type: 'string' }, // 'sponsor', 'seeker', 'doer'
        { name: 'location', type: 'string', isOptional: true },
        { name: 'is_in_gaza', type: 'boolean' },
        { name: 'bio', type: 'string', isOptional: true },
        { name: 'avatar', type: 'string', isOptional: true },
        { name: 'is_verified', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // Sync fields for offline-first functionality
        { name: 'server_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'last_sync_at', type: 'number', isOptional: true },
        { name: 'is_deleted', type: 'boolean' },
        { name: 'needs_sync', type: 'boolean' },
      ],
    }),
    
    // UserSkills table
    tableSchema({
      name: 'user_skills',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'skill', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    
    // Requests table
    tableSchema({
      name: 'requests',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' }, // 'donation', 'exchange', 'service'
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'location', type: 'string', isOptional: true },
        { name: 'status', type: 'string' }, // 'approved', 'rejected', 'matched', 'done'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    
    // Matches table
    tableSchema({
      name: 'matches',
      columns: [
        { name: 'request_id', type: 'string', isIndexed: true },
        { name: 'matched_with_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string' }, // 'initiated', 'confirmed', 'cancelled'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    
    // Transactions table
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'sponsor_id', type: 'string', isIndexed: true },
        { name: 'seeker_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'request_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'string' },
        { name: 'status', type: 'string' }, // 'pending', 'paid', 'failed'
        { name: 'checkout_ref', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    
    // Reports table
    tableSchema({
      name: 'reports',
      columns: [
        { name: 'request_id', type: 'string', isIndexed: true },
        { name: 'reported_by', type: 'string', isIndexed: true },
        { name: 'reason', type: 'string', isOptional: true },
        { name: 'status', type: 'string' }, // 'pending', 'reviewed'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    
    // MyMissions table - for user's personal missions
    tableSchema({
      name: 'my_missions',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'location', type: 'string', isOptional: true }, // Optional display name for location
        { name: 'latitude', type: 'number' }, // Required - primary location identifier
        { name: 'longitude', type: 'number' }, // Required - primary location identifier
        { name: 'coordinates', type: 'string', isOptional: true }, // Deprecated - keeping for backward compatibility
        { name: 'payment_type', type: 'string' }, // 'Volunteer', 'Paid', 'Sponsor'
        { name: 'amount', type: 'number', isOptional: true },
        { name: 'urgency', type: 'string' }, // 'Urgent', 'Soon', 'Flexible'
        { name: 'status', type: 'string' }, // 'active', 'matched', 'completed', 'cancelled'
        { name: 'skills', type: 'string', isOptional: true }, // JSON array of required skills
        { name: 'image_uri', type: 'string', isOptional: true },
        { name: 'image_id', type: 'string', isOptional: true }, // Cloudflare image ID
        { name: 'bg_image', type: 'string', isOptional: true },
        { name: 'bg_image_id', type: 'string', isOptional: true }, // Cloudflare background image ID
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // Sync fields for offline-first functionality
        { name: 'server_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'last_sync_at', type: 'number', isOptional: true },
        { name: 'is_deleted', type: 'boolean' },
        { name: 'needs_sync', type: 'boolean' },
      ],
    }),

    // GlobalMissions table - for all missions from other users (cached for offline)
    tableSchema({
      name: 'global_missions',
      columns: [
        { name: 'server_id', type: 'string', isIndexed: true }, // Server ID is primary here
        { name: 'user_id', type: 'string', isIndexed: true }, // Owner of the mission
        { name: 'user_name', type: 'string' }, // Cache user name for display
        { name: 'user_avatar', type: 'string', isOptional: true },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'location', type: 'string', isOptional: true }, // Optional display name for location
        { name: 'latitude', type: 'number' }, // Required - primary location identifier
        { name: 'longitude', type: 'number' }, // Required - primary location identifier
        { name: 'coordinates', type: 'string', isOptional: true }, // Deprecated - keeping for backward compatibility
        { name: 'payment_type', type: 'string' }, // 'Volunteer', 'Paid', 'Sponsor'
        { name: 'amount', type: 'number', isOptional: true },
        { name: 'urgency', type: 'string' }, // 'Urgent', 'Soon', 'Flexible'
        { name: 'status', type: 'string' }, // 'active', 'matched', 'completed', 'cancelled'
        { name: 'skills', type: 'string', isOptional: true }, // JSON array of required skills
        { name: 'image_uri', type: 'string', isOptional: true },
        { name: 'image_id', type: 'string', isOptional: true }, // Cloudflare image ID
        { name: 'bg_image', type: 'string', isOptional: true },
        { name: 'bg_image_id', type: 'string', isOptional: true }, // Cloudflare background image ID
        { name: 'distance_km', type: 'number', isOptional: true }, // Distance from user
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'last_sync_at', type: 'number' },
      ],
    }),
    
    // Notifications table (new)
    tableSchema({
      name: 'notifications',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' }, // 'mission', 'reminder', 'match', etc.
        { name: 'title', type: 'string' },
        { name: 'message', type: 'string' },
        { name: 'is_read', type: 'boolean' },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'color', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    
    // Donations table
    tableSchema({
      name: 'donations',
      columns: [
        { name: 'donor_id', type: 'string', isIndexed: true }, // User who donated
        { name: 'mission_id', type: 'string', isIndexed: true }, // Mission being donated to
        { name: 'amount', type: 'number' }, // Donation amount
        { name: 'currency', type: 'string' }, // 'USD', 'EUR', etc.
        { name: 'payment_method', type: 'string' }, // 'card', 'paypal', etc.
        { name: 'checkout_session_id', type: 'string', isOptional: true }, // Checkout.com session ID
        { name: 'payment_id', type: 'string', isOptional: true }, // Payment provider ID
        { name: 'status', type: 'string' }, // 'pending', 'completed', 'failed', 'refunded'
        { name: 'message', type: 'string', isOptional: true }, // Optional donation message
        { name: 'is_anonymous', type: 'boolean' }, // Whether donation is anonymous
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // Sync fields for offline-first functionality
        { name: 'server_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'last_sync_at', type: 'number', isOptional: true },
        { name: 'is_deleted', type: 'boolean' },
        { name: 'needs_sync', type: 'boolean' },
      ],
    }),
  ],
});