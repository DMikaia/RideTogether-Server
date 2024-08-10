import { Controller, HttpStatus, Param, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { reviewContract } from './review-contract';
import { UserService } from 'src/user/user.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ReqWithUser } from 'src/auth/request/req-user';
import { CreateReviewDto } from './dto/create.dto';
import { UpdateReviewDto } from './dto/update.dto';
import { ErrorService } from 'src/error/error.service';

@Auth()
@Controller()
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly errorService: ErrorService,
    private readonly userService: UserService,
  ) {}

  @TsRestHandler(reviewContract.create)
  async create(@Req() req: ReqWithUser) {
    return tsRestHandler(reviewContract.create, async ({ body }) => {
      try {
        const id = await this.userService.getUserId(req.user.email);

        await this.reviewsService.create(id, body as CreateReviewDto);

        return {
          status: HttpStatus.CREATED,
          body: {
            message: 'Your review has been created',
          },
        };
      } catch (error) {
        await this.errorService.handleApiError(error, 'review');
      }
    });
  }

  @TsRestHandler(reviewContract.get)
  async findAll(@Param('id') id: string) {
    return tsRestHandler(reviewContract.get, async ({}) => {
      try {
        const reviews = await this.reviewsService.findAll(id);

        if (reviews) {
          return {
            status: HttpStatus.OK,
            body: reviews,
          };
        }
      } catch (error) {
        await this.errorService.handleApiError(error, 'review/:id');
      }
    });
  }

  @TsRestHandler(reviewContract.update)
  async update(@Param('id') id: string) {
    return tsRestHandler(reviewContract.update, async ({ body }) => {
      try {
        await this.reviewsService.update(id, body as UpdateReviewDto);

        return {
          status: HttpStatus.OK,
          body: {
            message: 'Your review has been updated',
          },
        };
      } catch (error) {
        await this.errorService.handleApiError(error, 'review');
      }
    });
  }

  @TsRestHandler(reviewContract.delete)
  async remove(@Req() req: ReqWithUser, @Param('id') id: string) {
    return tsRestHandler(reviewContract.delete, async ({}) => {
      try {
        const reviewerId = await this.userService.getUserId(req.user.email);

        await this.reviewsService.remove(reviewerId, id);

        return {
          status: HttpStatus.OK,
          body: {
            message: 'Your review has been removed',
          },
        };
      } catch (error) {
        await this.errorService.handleApiError(error, 'review');
      }
    });
  }
}
