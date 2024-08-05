export type Offer = {
  departurePlace: string;
  destinationPlace: string;
  departureDate: Date;
  image: string;
  vehicle: string;
  closed: boolean;
  owner: {
    image: string;
    username: string;
  };
  seats: number;
  taken: number;
};

export type CurrentOffer = Offer & {
  room: {
    id: string;
    name: string;
  };
};
