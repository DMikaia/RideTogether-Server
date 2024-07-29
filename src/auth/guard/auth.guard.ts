import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ReqWithUser } from '../request/req-user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.firebaseService.getFirebaseApp();
    const request = context.switchToHttp().getRequest<ReqWithUser>();
    const sessionCookie = request.headers?.authorization?.split(' ')[1];

    if (!sessionCookie) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = await app
        .auth()
        .verifySessionCookie(sessionCookie, true);

      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
      request.token = sessionCookie;

      return true;
    } catch (error) {
      console.log('Error verifying token:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
