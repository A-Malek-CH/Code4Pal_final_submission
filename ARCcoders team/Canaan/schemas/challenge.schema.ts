import { z } from 'zod';

export const challengeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  type: z.string().min(1, 'Type is required'),
  target: z.coerce.number().int().min(1, 'Target must be at least 1'),
  reward_id: z.string().uuid('Must be a valid reward UUID'),
  variant: z.enum(['static', 'daily', 'weekly']).default('static'),
  date: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type ChallengeFormValues = z.infer<typeof challengeSchema>;
