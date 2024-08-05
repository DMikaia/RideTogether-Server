import { Controller, HttpStatus, Logger, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { TsRestException, tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { authContract } from './auth-contract';
import { Auth } from './decorator/auth.decorator';
import { ReqWithUser } from './request/req-user';
import { Prisma } from '@prisma/client';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
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
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /login: ${error}`);

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
        if (error instanceof TsRestException) throw error;
        this.logger.error(`Error at /logout: ${error}`);

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
