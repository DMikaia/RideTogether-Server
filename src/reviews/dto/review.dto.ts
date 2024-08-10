export class ReviewDto {
  id: string;
  createdAt: Date;
  text: string;
  stars: number;
  reviewer: {
    id: string;
    name: string;
    username: string;
    image: string;
  };
}
