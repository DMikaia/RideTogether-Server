import { Controller, HttpStatus, Param, Req } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { UserService } from 'src/user/user.service';
import { offerContract } from './offer-contract';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ReqWithUser } from 'src/auth/request/req-user';
import { OfferService } from './offer.service';
import { Prisma } from '@prisma/client';
import { ErrorService } from 'src/error/error.service';

@Auth()
@Controller()
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly errorService: ErrorService,
    private readonly userService: UserService,
  ) {}

  @TsRestHandler(offerContract.createOffer)
  async createOffer(@Req() req: ReqWithUser) {
    return tsRestHandler(offerContract.createOffer, async ({ body }) => {
      try {
        const user = await this.userService.getUser(req.user.email);

        if (user) {
          const { room, ...data } = body;

          await this.offerService.createOffer(
            user.id,
            room,
            data as Prisma.OfferCreateWithoutOwnerInput,
          );

          return {
            status: HttpStatus.CREATED,
            body: {
              message: 'Offer has been created',
            },
          };
        }
      } catch (error) {
        await this.errorService.handleApiError(error, 'offer');
      }
    });
  }

  @TsRestHandler(offerContract.getAllOffer)
  async getAllOffers(@Req() req: ReqWithUser) {
    return tsRestHandler(offerContract.getAllOffer, async () => {
      try {
        const user = await this.userService.getUser(req.user.email);

        if (user) {
          const offers = await this.offerService.getAvailableOffers(user.id);

          return {
            status: HttpStatus.OK,
            body: offers,
          };
        }
      } catch (error) {
        await this.errorService.handleApiError(error, 'offer');
      }
    });
  }

  @TsRestHandler(offerContract.getUserOffer)
  async getUserOffer(@Param('id') id: string) {
    return tsRestHandler(offerContract.getUserOffer, async () => {
      try {
        const offers = await this.offerService.getUserOffer(id);

        if (offers) {
          return {
            status: HttpStatus.OK,
            body: offers,
          };
        }
      } catch (error) {
        await this.errorService.handleApiError(error, 'offer');
      }
    });
  }

  @TsRestHandler(offerContract.addParticipant)
  async addParticipant(@Req() req: ReqWithUser, @Param('id') id: string) {
    return tsRestHandler(offerContract.addParticipant, async () => {
      try {
        const user = await this.userService.getUser(req.user.email);
        const isFull = await this.offerService.isOfferFull(id);

        if (isFull) {
          return {
            status: HttpStatus.BAD_REQUEST,
            body: {
              message: 'This offer is already full',
            },
          };
        }

        await this.offerService.addPariticipant(user.id, id);

        return {
          status: HttpStatus.OK,
          body: {
            message: 'You have been added to the offer',
          },
        };
      } catch (error) {
        await this.errorService.handleApiError(error, 'offer');
      }
    });
  }
}
