import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create.dto';
import { UpdateReviewDto } from './dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { ReviewDto } from './dto/review.dto';
import {
  reviewSelect,
  reviewWithRecipientSelect,
} from './select/review.select';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async create(id: string, createReviewDto: CreateReviewDto) {
    const newReview = await this.prismaService.client.review.create({
      data: {
        ...createReviewDto,
        recipient: {
          connect: {
            id: createReviewDto.recipient,
          },
        },
        reviewer: {
          connect: {
            id,
          },
        },
      },
      select: reviewSelect,
    });

    await this.redisService.pushNewData<ReviewDto>(
      `review:${createReviewDto.recipient}`,
      newReview,
      1500,
    );
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prismaService.client.review.findFirst({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!review) {
      throw new Error(
        "Review not found or you don't have permission to update it.",
      );
    }

    const newReview = await this.prismaService.client.review.update({
      data: updateReviewDto,
      where: {
        id,
      },
      select: reviewWithRecipientSelect,
    });

    const { recipient, ...data } = newReview;

    await this.redisService.updateDataArray<ReviewDto, ReviewDto>(
      `review:${recipient.id}`,
      data,
      1500,
    );
  }

  async remove(id: string, reviewId: string) {
    const review = await this.prismaService.client.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: id,
      },
      select: reviewWithRecipientSelect,
    });

    if (!review) {
      throw new Error(
        "Review not found or you don't have permission to delete it.",
      );
    }

    const { recipient, ...data } = review;

    await this.prismaService.client.review.delete({
      where: {
        id: reviewId,
      },
    });
    await this.redisService.removeDataArray<ReviewDto>(
      `review:${recipient.id}`,
      data,
      1500,
    );
  }

  async findAll(id: string) {
    const data = await this.redisService.getCachedData<ReviewDto[]>(
      `review:${id}`,
    );

    if (data) {
      return data;
    }

    const reviews = await this.prismaService.client.review.findMany({
      where: {
        recipientId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: reviewSelect,
    });

    if (reviews) {
      await this.redisService.setCachedData<ReviewDto[]>(
        `review:${id}`,
        reviews,
        1500,
      );

      return reviews;
    }
  }
}
