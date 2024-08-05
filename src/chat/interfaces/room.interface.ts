export interface Room {
  id: string;
  name: string;
  ownerId: string;
  participants: {
    id: string;
  }[];
}
