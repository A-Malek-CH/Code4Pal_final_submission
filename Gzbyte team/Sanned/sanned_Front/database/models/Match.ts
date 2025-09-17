import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import Request from './Request';
import User from './User';

export default class Match extends Model {
  static table = 'matches';
  static associations = {
    requests: { type: 'belongs_to' as const, key: 'request_id' },
    users: { type: 'belongs_to' as const, key: 'matched_with_id' },
  };

  @field('request_id') requestId!: string;
  @field('matched_with_id') matchedWithId!: string;
  @field('status') status!: string; // 'initiated' | 'confirmed' | 'cancelled'

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('requests', 'request_id') request!: Relation<Request>;
  @relation('users', 'matched_with_id') matchedWithUser!: Relation<User>;
}