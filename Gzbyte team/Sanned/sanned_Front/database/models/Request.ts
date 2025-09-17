import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import User from './User';

export default class Request extends Model {
  static table = 'requests';
  static associations = {
    users: { type: 'belongs_to' as const, key: 'user_id' },
    matches: { type: 'has_many' as const, foreignKey: 'request_id' },
    transactions: { type: 'has_many' as const, foreignKey: 'request_id' },
    reports: { type: 'has_many' as const, foreignKey: 'request_id' },
  };

  @field('user_id') userId!: string;
  @field('type') type!: string; // 'donation' | 'exchange' | 'service'
  @field('title') title!: string;
  @field('description') description!: string;
  @field('location') location!: string;
  @field('status') status!: string; // 'approved' | 'rejected' | 'matched' | 'done'

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('users', 'user_id') user!: Relation<User>;
  @children('matches') matches!: any[];
  @children('transactions') transactions!: any[];
  @children('reports') reports!: any[];
}