import { z } from 'zod';

export const updateSchema = z.object({
  text: z.string().min(1).optional(),
  stars: z.number().optional(),
});
