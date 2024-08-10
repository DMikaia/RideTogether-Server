export type Offer = {
  id: string;
  departurePlace: string;
  destinationPlace: string;
  departureDate: Date;
  createdAt: Date;
  image: string;
  vehicle: string;
  closed: boolean;
  owner: {
    id: string;
    image: string;
    name: string;
    username: string;
  };
  participants: {
    id: string;
  }[];
  seats: number;
  taken: number;
};
