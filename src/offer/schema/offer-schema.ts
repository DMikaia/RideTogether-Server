import z from 'zod';

export const offerSchema = z
  .object({
    departurePlace: z.string().min(1, 'Departure place is required'),
    destinationPlace: z.string().min(1, 'Destination place is required'),
    departureDate: z
      .string()
      .datetime()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      }),
    image: z.string().optional(),
    vehicle: z.string().min(1, 'Vehicle model is required'),
    seats: z.number(),
  })
  .strict();
