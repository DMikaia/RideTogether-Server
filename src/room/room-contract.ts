import { initContract } from '@ts-rest/core';
import { Room } from './dto/room.dto';
import { z } from 'zod';

const c = initContract();

export const roomContract = c.router({
  getRoomList: {
    method: 'GET',
    path: '/room',
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
});
