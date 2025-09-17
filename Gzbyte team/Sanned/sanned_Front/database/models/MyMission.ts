import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class MyMission extends Model {
  static table = 'my_missions';

  @field('user_id') userId!: string;
  @field('title') title!: string;
  @field('description') description!: string;
  @field('location') location?: string; // Optional display name
  @field('latitude') latitude!: number; // Primary location identifier
  @field('longitude') longitude!: number; // Primary location identifier
  @field('coordinates') coordinatesJson?: string; // Deprecated - JSON string for lat/lng
  @field('payment_type') paymentType!: string; // 'Volunteer', 'Paid', 'Sponsor'
  @field('amount') amount?: number;
  @field('urgency') urgency!: string; // 'Urgent', 'Soon', 'Flexible'
  @field('status') status!: string; // 'active', 'matched', 'completed', 'cancelled'
  @field('skills') skills?: string; // JSON array of required skills
  @field('image_uri') imageUri?: string;
  @field('image_id') imageId?: string; // Cloudflare image ID
  @field('bg_image') bgImage?: string;
  @field('bg_image_id') bgImageId?: string; // Cloudflare background image ID
  
  // Sync fields for offline-first functionality
  @field('server_id') serverId?: string;
  @field('last_sync_at') lastSyncAt?: number;
  @field('is_deleted') isDeleted!: boolean;
  @field('needs_sync') needsSync!: boolean;
  
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Helper methods
  get skillsArray(): string[] {
    if (!this.skills) return [];
    try {
      return JSON.parse(this.skills);
    } catch {
      return [];
    }
  }

  // Primary coordinate access (preferred)
  get coordinates(): { latitude: number; longitude: number } {
    return {
      latitude: this.latitude,
      longitude: this.longitude
    };
  }

  // Backward compatibility - deprecated
  get coordinatesObject(): { latitude: number; longitude: number } | null {
    // Use new fields if available
    if (this.latitude && this.longitude) {
      return { latitude: this.latitude, longitude: this.longitude };
    }
    // Fallback to old JSON field
    if (!this.coordinatesJson) return null;
    try {
      return JSON.parse(this.coordinatesJson);
    } catch {
      return null;
    }
  }

  // Get location display name with fallback
  get displayLocation(): string {
    if (this.location) return this.location;
    return `${this.latitude.toFixed(4)}, ${this.longitude.toFixed(4)}`;
  }

  // Get optimized image URL if using Cloudflare
  getImageUrl(width?: number, height?: number): string | undefined {
    if (this.imageId) {
      // Use Cloudflare image service with transformations
      let url = `${process.env.EXPO_PUBLIC_CLOUDFLARE_DELIVERY_URL || 'https://imagedelivery.net/your-hash'}/${this.imageId}`;
      const params = [];
      if (width) params.push(`w=${width}`);
      if (height) params.push(`h=${height}`);
      if (params.length > 0) url += `/${params.join(',')}/public`;
      return url;
    }
    // Fallback to direct URI
    return this.imageUri;
  }

  get isActive(): boolean {
    return this.status === 'active';
  }

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isMatched(): boolean {
    return this.status === 'matched';
  }

  get urgencyColor(): string {
    switch (this.urgency) {
      case 'Urgent': return '#ef4444';
      case 'Soon': return '#f59e0b';
      case 'Flexible': return '#10b981';
      default: return '#6b7280';
    }
  }

  get paymentTypeColor(): string {
    switch (this.paymentType) {
      case 'Paid': return '#10b981';
      case 'Sponsor': return '#3b82f6';
      case 'Volunteer': return '#8b5cf6';
      default: return '#6b7280';
    }
  }
}