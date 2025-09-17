import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';
  static associations = {
    user_skills: { type: 'has_many' as const, foreignKey: 'user_id' },
    requests: { type: 'has_many' as const, foreignKey: 'user_id' },
    notifications: { type: 'has_many' as const, foreignKey: 'user_id' },
    sponsored_transactions: { type: 'has_many' as const, foreignKey: 'sponsor_id' },
    received_transactions: { type: 'has_many' as const, foreignKey: 'seeker_id' },
    reports: { type: 'has_many' as const, foreignKey: 'reported_by' },
  };

  @field('name') name!: string;
  @field('email') email!: string;
  @field('phone') phone!: string;
  @field('password_hash') passwordHash!: string;
  @field('role') role!: string; // 'sponsor' | 'seeker' | 'doer'
  @field('location') location!: string;
  @field('is_in_gaza') isInGaza!: boolean;
  @field('bio') bio!: string;
  @field('avatar') avatar!: string;
  @field('is_verified') isVerified!: boolean;

  // Sync fields for offline-first functionality
  @field('server_id') serverId!: string;
  @field('last_sync_at') lastSyncAt!: number;
  @field('is_deleted') isDeleted!: boolean;
  @field('needs_sync') needsSync!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('user_skills') userSkills!: any[];
  @children('requests') requests!: any[];
  @children('notifications') notifications!: any[];
  @children('transactions') sponsoredTransactions!: any[];
  @children('transactions') receivedTransactions!: any[];
  @children('reports') reports!: any[];
}