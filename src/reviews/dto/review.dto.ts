export class ReviewDto {
  id: string;
  createdAt: Date;
  text: string;
  stars: number;
  reviewer: {
    name: string;
    username: string;
    image: string;
  };
}
