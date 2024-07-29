import { Controller, HttpStatus, Logger } from '@nestjs/common';
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

  @TsRestHandler(authContract.register)
  async register() {
    return tsRestHandler(authContract.register, async ({ body }) => {
      try {
        const exist = await this.userService.checkIfUserExists(body.email);

        if (exist) {
          // We throw an error if the user already exists
          return {
            status: HttpStatus.CONFLICT,
            body: {
              message: 'Email already taken',
            },
          };
        }

        // Separating password from the other data
        const { password, ...data } = body;

        // Creating user in Postgres and Firebase authentication
        await this.userService.createUser(data as Prisma.UserCreateInput);
        await this.authService.createUserInFirebase(data.email, password);
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
          const user = await this.userService.getUser(
            payload.decodedToken.email,
          );

          const { sessionCookie, expiresIn } =
            await this.authService.createSessionCookie(accessToken);

          const data = {
            user,
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
  public async logout(request: ReqWithUser) {
    return tsRestHandler(authContract.logout, async () => {
      try {
        const accessToken = request.token;

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
