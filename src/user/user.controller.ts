import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { TsRestException, tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { userContract } from './user-contract';
import { Prisma } from '@prisma/client';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ReqWithUser } from 'src/auth/request/req-user';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @TsRestHandler(userContract.uploadProfile)
  async uploadProfile() {
    return tsRestHandler(userContract.uploadProfile, async ({ body }) => {
      try {
        await this.userService.updateUser(
          body.email,
          body.image as Prisma.UserUpdateInput,
        );

        return {
          status: HttpStatus.OK,
          body: {
            message: 'User profile updated successfully',
          },
        };
      } catch (error) {
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /register: ${error}`);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        };
      }
    });
  }

  @Auth()
  @TsRestHandler(userContract.me)
  async getUser(req: ReqWithUser) {
    return tsRestHandler(userContract.me, async () => {
      try {
        const information = await this.userService.getUser(req.user.email);

        if (information) {
          return {
            status: HttpStatus.OK,
            body: information,
          };
        }
      } catch (error) {
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /register: ${error}`);
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
