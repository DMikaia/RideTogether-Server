import { Controller, HttpStatus, Logger, Param, Req } from '@nestjs/common';
import { TsRestException, tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { UserService } from 'src/user/user.service';
import { offerContract } from './offer-contract';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ReqWithUser } from 'src/auth/request/req-user';
import { OfferService } from './offer.service';
import { Prisma } from '@prisma/client';

@Auth()
@Controller()
export class OfferController {
  private readonly logger = new Logger(OfferController.name);

  constructor(
    private readonly offerService: OfferService,
    private readonly userService: UserService,
  ) {}

  @TsRestHandler(offerContract.createOffer)
  async createOffer(@Req() req: ReqWithUser) {
    return tsRestHandler(offerContract.createOffer, async ({ body }) => {
      try {
        const user = await this.userService.getUser(req.user.email);

        if (user) {
          await this.offerService.createOffer(
            user.id,
            body as Prisma.OfferCreateWithoutOwnerInput,
          );

          return {
            status: HttpStatus.CREATED,
            body: {
              message: 'Offer has been created',
            },
          };
        }
      } catch (error) {
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /offer: ${error}`);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        };
      }
    });
  }

  @TsRestHandler(offerContract.getAllOffer)
  async getAllOffers(@Req() req: ReqWithUser) {
    return tsRestHandler(offerContract.getAllOffer, async () => {
      try {
        const user = await this.userService.getUser(req.user.email);

        if (user) {
          const offers = await this.offerService.getAvailableOffers();

          return {
            status: HttpStatus.OK,
            body: offers,
          };
        }
      } catch (error) {
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /offer: ${error}`);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        };
      }
    });
  }

  @TsRestHandler(offerContract.getMyOffer)
  async getMyOffer(@Param('id') id: string) {
    return tsRestHandler(offerContract.getMyOffer, async () => {
      try {
        const offer = await this.offerService.getMyCurrentOffer(id);

        if (offer) {
          return {
            status: HttpStatus.OK,
            body: offer,
          };
        }
      } catch (error) {
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /offer: ${error}`);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        };
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
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /offer: ${error}`);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        };
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
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /offer: ${error}`);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        };
      }
    });
  }
}
