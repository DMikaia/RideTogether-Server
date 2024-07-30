import { initContract } from '@ts-rest/core';
import { registerSchema } from './schema/register-schema';
import { z } from 'zod';
import { AuthDto } from './dto/auth.dto';

const c = initContract();

export const authContract = c.router({
  check: {
    method: 'POST',
    path: '/email',
    body: z.object({
      email: z
        .string({ required_error: 'Email is required ' })
        .email('Email must be valid'),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<{ message: string }>(),
      400: c.type<{ message: string }>(),
      409: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  register: {
    method: 'POST',
    path: '/register',
    body: registerSchema,
    strictStatusCodes: true,
    responses: {
      201: c.type<{ message: string }>(),
      400: c.type<{ message: string }>(),
      409: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  login: {
    method: 'POST',
    path: '/login',
    body: c.type<null>(),
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<AuthDto>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      404: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  logout: {
    method: 'POST',
    path: '/logout',
    body: c.type<null>(),
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<null>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      404: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
});
