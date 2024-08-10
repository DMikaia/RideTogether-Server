import { Prisma } from '@prisma/client';

export const offerSelect: Prisma.OfferSelect = {
  id: true,
  owner: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  },
  participants: {
    select: {
      id: true,
    },
  },
  closed: true,
  seats: true,
  taken: true,
  createdAt: true,
  departurePlace: true,
  destinationPlace: true,
  departureDate: true,
  image: true,
  vehicle: true,
};
