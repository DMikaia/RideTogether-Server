import { Controller, HttpStatus, Logger, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { TsRestException, tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { userContract } from './user-contract';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ReqWithUser } from 'src/auth/request/req-user';

@Auth()
@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @TsRestHandler(userContract.uploadProfile)
  async uploadProfile(@Req() req: ReqWithUser) {
    return tsRestHandler(userContract.uploadProfile, async ({ body }) => {
      try {
        await this.userService.updateUser(req.user.email, body.image);

        return {
          status: HttpStatus.OK,
          body: {
            message: 'User profile updated successfully',
          },
        };
      } catch (error) {
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /profile: ${error}`);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        };
      }
    });
  }

  @TsRestHandler(userContract.me)
  async getUser(@Req() req: ReqWithUser) {
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
        this.logger.error(`Error at /me: ${error}`);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        };
      }
    });
  }

  @TsRestHandler(userContract.profile)
  async getUserProfile(@Param('id') id: string) {
    return tsRestHandler(userContract.profile, async () => {
      try {
        const information = await this.userService.getUserById(id);

        if (information) {
          return {
            status: HttpStatus.OK,
            body: information,
          };
        }
      } catch (error) {
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /me: ${error}`);
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
