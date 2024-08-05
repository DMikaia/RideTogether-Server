import { z } from 'zod';

export const createSchema = z.object({
  recipient: z.string().min(1),
  text: z.string().min(1),
  stars: z.number(),
});
