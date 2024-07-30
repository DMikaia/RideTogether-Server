import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Full name is required' })
      .min(1, { message: 'Full name is required' }),
    username: z
      .string({ required_error: 'Username is required' })
      .min(1, { message: 'Username is required' }),
    email: z
      .string({ required_error: 'Email is required ' })
      .email({ message: 'Email must be valid' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(16, { message: ' Password maximum characters is 16' }),
  })
  .strict();
