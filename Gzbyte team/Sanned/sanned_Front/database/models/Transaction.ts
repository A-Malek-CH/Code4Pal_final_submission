import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import User from './User';
import Request from './Request';

export default class Transaction extends Model {
  static table = 'transactions';
  static associations = {
    sponsor: { type: 'belongs_to' as const, key: 'sponsor_id' },
    seeker: { type: 'belongs_to' as const, key: 'seeker_id' },
    requests: { type: 'belongs_to' as const, key: 'request_id' },
  };

  @field('sponsor_id') sponsorId!: string;
  @field('seeker_id') seekerId!: string;
  @field('request_id') requestId!: string;
  @field('amount') amount!: number;
  @field('currency') currency!: string;
  @field('status') status!: string; // 'pending' | 'paid' | 'failed'
  @field('checkout_ref') checkoutRef!: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('users', 'sponsor_id') sponsor!: Relation<User>;
  @relation('users', 'seeker_id') seeker!: Relation<User>;
  @relation('requests', 'request_id') request!: Relation<Request>;
}