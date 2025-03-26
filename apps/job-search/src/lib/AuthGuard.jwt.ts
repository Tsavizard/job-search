import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { Authenticator } from './Authenticator';

@Injectable()
/**
 * AuthGuard for /api routes that require a JWT token.
 */
export class AuthGuardJWT implements CanActivate {
  private authenticator: Authenticator;
  private readonly uuidV4Pattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(configService: ConfigService) {
    this.authenticator = new Authenticator(configService);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const [authType, token] = request.headers.authorization?.split(' ') ?? [];
    if (authType !== 'Bearer' || !token)
      throw new UnauthorizedException('No authentication provided');

    const { isValidToken, userId } = this.authenticator.verifyAuthToken(token);
    if (!isValidToken) throw new UnauthorizedException('Invalid token');

    if (!this.isValidUuidV4(userId as string)) {
      throw new UnauthorizedException('Invalid user identifier');
    }
    request.userId = userId;
    return !!request.userId;
  }

  private isValidUuidV4(uuid: string): boolean {
    return this.uuidV4Pattern.test(uuid);
  }
}
