import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { UserDto } from './dto/user.dto';

const c = initContract();

export const userContract = c.router({
  uploadProfile: {
    method: 'POST',
    path: '/profile',
    body: z.object({
      email: z.string().email('Email should be a valid one'),
      image: z.string().url({ message: 'Image must be a valid url' }),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<{ message: string }>(),
      400: c.type<{ message: string }>(),
      404: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  me: {
    method: 'GET',
    path: '/me',
    headers: z.object({
      authorization: z.string().startsWith('Bearer '),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<UserDto>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
});
