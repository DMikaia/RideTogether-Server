import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TsRestException } from '@ts-rest/nest';
import { DecodedIdToken } from 'firebase-admin/auth';
import { admin } from 'src/firebase/firebase.service';
import { authContract } from './auth-contract';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async createUserInFirebase(email: string, password: string) {
    return admin.auth().createUser({ email, password });
  }

  async createSessionCookie(accessToken: string): Promise<{
    sessionCookie: string;
    expiresIn: number;
  }> {
    try {
      const expiresIn = 60 * 60 * 24 * 10 * 1000;
      const sessionCookie = await admin
        .auth()
        .createSessionCookie(accessToken, {
          expiresIn,
        });

      return { sessionCookie, expiresIn };
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async verifyToken(accessToken: string): Promise<{
    decodedToken: DecodedIdToken;
  }> {
    const decodedToken = await admin.auth().verifyIdToken(accessToken);

    return { decodedToken };
  }

  async revokeToken(sessionCookie: string): Promise<void> {
    try {
      const decodedClaims = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);

      await admin.auth().revokeRefreshTokens(decodedClaims.sub);
    } catch (error) {
      if (error instanceof Error) {
        throw new TsRestException(authContract.logout, {
          body: {
            message: "You're not authorized to access this resource",
          },
          status: HttpStatus.UNAUTHORIZED,
        });
      }
      this.logger.error(`Error revoking token: ${error}`);
      throw new TsRestException(authContract.logout, {
        body: {
          message: 'Error revoking token',
        },
        status: 500,
      });
    }
  }
}
