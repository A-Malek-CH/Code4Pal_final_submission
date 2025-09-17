import { StateCreator } from 'zustand';
import { database } from '~/database';
import { UserSkill } from '~/database/models';
import { Q } from '@nozbe/watermelondb';
import { AppStore, SkillsState, SkillsActions, Skill } from '../types';

export interface SkillsSlice extends SkillsState, SkillsActions {}

export const createSkillsSlice: StateCreator<
  AppStore,
  [],
  [],
  SkillsSlice
> = (set, get) => ({
  // Initial state
  userSkills: [],

  // Actions
  loadUserSkills: async (userId: string) => {
    try {
      const dbSkills = await database
        .get<UserSkill>('user_skills')
        .query(Q.where('user_id', userId))
        .fetch();
      
      const userSkills: Skill[] = dbSkills.map(s => ({
        id: s.id,
        userId: s.userId,
        skill: s.skill,
      }));
      
      set({ userSkills });
    } catch (error) {
      console.error('Failed to load user skills:', error);
    }
  },

  addUserSkill: async (skill: string) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');
      
      await database.write(async () => {
        const newSkill = await database.get<UserSkill>('user_skills').create(s => {
          s.userId = user.id;
          s.skill = skill;
          s.createdAt = new Date();
          s.updatedAt = new Date();
        });
        
        // Update local state
        set(state => ({
          userSkills: [...state.userSkills, {
            id: newSkill.id,
            userId: newSkill.userId,
            skill: newSkill.skill,
          }]
        }));
      });
    } catch (error) {
      console.error('Failed to add user skill:', error);
      throw error;
    }
  },

  removeUserSkill: async (skillId: string) => {
    try {
      await database.write(async () => {
        const skill = await database.get<UserSkill>('user_skills').find(skillId);
        await skill.markAsDeleted();
      });
      
      // Update local state
      set(state => ({
        userSkills: state.userSkills.filter(s => s.id !== skillId)
      }));
    } catch (error) {
      console.error('Failed to remove user skill:', error);
      throw error;
    }
  },

  clearSkills: () => set({ userSkills: [] }),
});