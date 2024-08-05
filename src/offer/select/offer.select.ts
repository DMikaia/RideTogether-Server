import { Prisma } from '@prisma/client';

export const offerSelect: Prisma.OfferSelect = {
  owner: {
    select: {
      username: true,
      image: true,
    },
  },
  closed: true,
  seats: true,
  taken: true,
  departurePlace: true,
  destinationPlace: true,
  departureDate: true,
  image: true,
  vehicle: true,
};

export const currentOfferSelect: Prisma.OfferSelect = {
  owner: {
    select: {
      username: true,
      image: true,
    },
  },
  closed: true,
  seats: true,
  taken: true,
  departurePlace: true,
  destinationPlace: true,
  departureDate: true,
  image: true,
  vehicle: true,
  room: {
    select: {
      id: true,
      name: true,
    },
  },
};
