import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import Request from './Request';
import User from './User';

export default class Report extends Model {
  static table = 'reports';
  static associations = {
    requests: { type: 'belongs_to' as const, key: 'request_id' },
    users: { type: 'belongs_to' as const, key: 'reported_by' },
  };

  @field('request_id') requestId!: string;
  @field('reported_by') reportedBy!: string;
  @field('reason') reason!: string;
  @field('status') status!: string; // 'pending' | 'reviewed'

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('requests', 'request_id') request!: Relation<Request>;
  @relation('users', 'reported_by') reportedByUser!: Relation<User>;
}