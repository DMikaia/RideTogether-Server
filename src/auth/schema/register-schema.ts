import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Email must be valid' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(16, { message: ' Password maximum characters is 16' }),
  })
  .strict();
