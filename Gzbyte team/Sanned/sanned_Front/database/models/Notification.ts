import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import User from './User';

export default class Notification extends Model {
  static table = 'notifications';
  static associations = {
    users: { type: 'belongs_to' as const, key: 'user_id' },
  };

  @field('user_id') userId!: string;
  @field('type') type!: string; // 'mission' | 'reminder' | 'match' | etc.
  @field('title') title!: string;
  @field('message') message!: string;
  @field('is_read') isRead!: boolean;
  @field('icon') icon!: string;
  @field('color') color!: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('users', 'user_id') user!: Relation<User>;
}