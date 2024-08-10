import { initContract } from '@ts-rest/core';
import { offerSchema } from './schema/offer-schema';
import { z } from 'zod';
import { Room, Offer } from './dto/offer.dto';

const c = initContract();

export const offerContract = c.router({
  createOffer: {
    method: 'POST',
    path: '/offer',
    body: offerSchema,
    headers: z.object({
      authorization: z.string().startsWith('Bearer '),
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
  addParticipant: {
    method: 'PATCH',
    path: '/offer/:id',
    body: c.type<null>(),
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
      404: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  getAllOffer: {
    method: 'GET',
    path: '/offer',
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<Offer[]>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      404: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  getMyOffer: {
    method: 'GET',
    path: '/room/',
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<Room[]>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      404: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
  getUserOffer: {
    method: 'GET',
    path: '/offer/:id',
    headers: z.object({
      authorization: z
        .string({ required_error: 'Token required' })
        .startsWith('Bearer '),
    }),
    strictStatusCodes: true,
    responses: {
      200: c.type<Offer[]>(),
      400: c.type<{ message: string }>(),
      401: c.type<{ message: string }>(),
      403: c.type<{ message: string }>(),
      404: c.type<{ message: string }>(),
      500: c.type<{ message: string }>(),
    },
  },
});
