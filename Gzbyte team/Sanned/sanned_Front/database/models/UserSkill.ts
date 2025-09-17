import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import User from './User';

export default class UserSkill extends Model {
  static table = 'user_skills';
  static associations = {
    users: { type: 'belongs_to' as const, key: 'user_id' },
  };

  @field('user_id') userId!: string;
  @field('skill') skill!: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('users', 'user_id') user!: Relation<User>;
}