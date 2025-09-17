import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class GlobalMission extends Model {
  static table = 'global_missions';

  @field('server_id') serverId!: string;
  @field('user_id') userId!: string;
  @field('user_name') userName!: string;
  @field('user_avatar') userAvatar?: string;
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
  @field('distance_km') distanceKm?: number; // Distance from current user
  
  @field('last_sync_at') lastSyncAt!: number;
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

  get isPaid(): boolean {
    return this.paymentType === 'Paid';
  }

  get isVolunteer(): boolean {
    return this.paymentType === 'Volunteer';
  }

  get isSponsored(): boolean {
    return this.paymentType === 'Sponsor';
  }

  get isUrgent(): boolean {
    return this.urgency === 'Urgent';
  }

  get formattedAmount(): string {
    if (!this.amount) return '';
    return `$${this.amount.toFixed(2)}`;
  }

  get timeAgo(): string {
    const now = Date.now();
    const diff = now - this.createdAt.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  get distanceText(): string {
    if (!this.distanceKm) return '';
    if (this.distanceKm < 1) {
      return `${(this.distanceKm * 1000).toFixed(0)}m away`;
    }
    return `${this.distanceKm.toFixed(1)}km away`;
  }
}