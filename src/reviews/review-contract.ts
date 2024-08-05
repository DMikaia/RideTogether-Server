import { initContract } from '@ts-rest/core';
import { createSchema } from './schema/create-review';
import { updateSchema } from './schema/update-review';
import { z } from 'zod';
import { ReviewDto } from './dto/review.dto';

const c = initContract();

export const reviewContract = c.router({
  create: {
    method: 'POST',
    path: '/review',
    body: createSchema,
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    strictStatusCodes: true,
    responses: {
      201: c.type<{ message: string }>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  update: {
    method: 'PATCH',
    path: '/review/:id',
    body: updateSchema,
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<{ message: string }>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  get: {
    method: 'GET',
    path: '/review/:id',
    strictStatusCodes: true,
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    responses: {
      200: c.type<ReviewDto[]>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  delete: {
    method: 'DELETE',
    path: 'review/:id',
    body: c.type<null>(),
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    responses: {
      200: c.type<{ message: string }>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
});
