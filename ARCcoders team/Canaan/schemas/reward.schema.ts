import { z } from 'zod';

export const rewardSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  icon: z.string().url('Must be a valid URL'),
  type: z.string().min(1, 'Type is required'),
});

export type RewardFormValues = z.infer<typeof rewardSchema>;
