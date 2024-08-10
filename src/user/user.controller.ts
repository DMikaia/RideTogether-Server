import { Controller, HttpStatus, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { userContract } from './user-contract';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ReqWithUser } from 'src/auth/request/req-user';
import { ErrorService } from 'src/error/error.service';

@Auth()
@Controller()
export class UserController {
  constructor(
    private readonly errorService: ErrorService,
    private readonly userService: UserService,
  ) {}

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
        await this.errorService.handleApiError(error, 'profile');
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
        await this.errorService.handleApiError(error, 'me');
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
        await this.errorService.handleApiError(error, 'user');
      }
    });
  }
}
