import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Donation extends Model {
  static table = 'donations';

  @field('donor_id') donorId!: string;
  @field('mission_id') missionId!: string;
  @field('amount') amount!: number;
  @field('currency') currency!: string;
  @field('payment_method') paymentMethod!: string;
  @field('checkout_session_id') checkoutSessionId?: string;
  @field('payment_id') paymentId?: string;
  @field('status') status!: string; // 'pending', 'completed', 'failed', 'refunded'
  @field('message') message?: string;
  @field('is_anonymous') isAnonymous!: boolean;
  
  // Sync fields
  @field('server_id') serverId?: string;
  @field('last_sync_at') lastSyncAt?: number;
  @field('is_deleted') isDeleted!: boolean;
  @field('needs_sync') needsSync!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}