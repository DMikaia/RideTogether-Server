import { Controller, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { authContract } from './auth-contract';
import { Auth } from './decorator/auth.decorator';
import { ReqWithUser } from './request/req-user';
import { Prisma } from '@prisma/client';
import { ErrorService } from 'src/error/error.service';

@Controller()
export class AuthController {
  constructor(
    private readonly errorService: ErrorService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @TsRestHandler(authContract.check)
  async checkEmail() {
    return tsRestHandler(authContract.check, async ({ body }) => {
      try {
        const response = await this.authService.checkEmail(body.email);

        if (response) {
          return {
            status: HttpStatus.CONFLICT,
            body: {
              message: 'The email address is already in use',
            },
          };
        }

        return {
          status: HttpStatus.OK,
          body: {
            message: 'The email address is not used yet',
          },
        };
      } catch (error) {
        await this.errorService.handleApiError(error, 'check');
      }
    });
  }

  @TsRestHandler(authContract.register)
  async register() {
    return tsRestHandler(authContract.register, async ({ body }) => {
      try {
        const exist = await this.userService.checkIfUserExists(body.username);

        if (exist) {
          // We throw an error if the user already exists
          return {
            status: HttpStatus.CONFLICT,
            body: {
              message: 'Username already taken',
            },
          };
        }

        // Separating password from the other data
        const { password, ...data } = body;

        // Creating user in Postgres and Firebase authentication
        await this.userService.createUser(data as Prisma.UserCreateInput);
        await this.authService.createUserInFirebase(data.email, password);

        return {
          status: HttpStatus.CREATED,
          body: {
            message: 'User created successfully',
          },
        };
      } catch (error) {
        await this.errorService.handleApiError(error, 'register');
      }
    });
  }

  @TsRestHandler(authContract.login)
  async login() {
    return tsRestHandler(authContract.login, async ({ headers }) => {
      const accessToken = headers.authorization.replace('Bearer ', '');

      try {
        const payload = await this.authService.verifyToken(accessToken);

        if (payload) {
          const { sessionCookie, expiresIn } =
            await this.authService.createSessionCookie(accessToken);

          const data = {
            expiration: expiresIn,
            cookie: sessionCookie,
          };

          return {
            status: HttpStatus.OK,
            body: data,
          };
        }
      } catch (error) {
        await this.errorService.handleApiError(error, 'login');
      }
    });
  }

  @Auth()
  @TsRestHandler(authContract.logout)
  public async logout(@Req() request: ReqWithUser) {
    return tsRestHandler(authContract.logout, async () => {
      try {
        const accessToken = request.token;

        await this.userService.removeUser(request.user.email);
        await this.authService.revokeToken(accessToken);

        return {
          status: HttpStatus.OK,
          body: null,
        };
      } catch (error) {
        await this.errorService.handleApiError(error, 'logout');
      }
    });
  }
}
