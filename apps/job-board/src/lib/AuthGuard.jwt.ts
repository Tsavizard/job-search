import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
/**
 * AuthGuard for /api routes that require a JWT token.
 */
export class AuthGuardJWT implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const [authType, token] = request.headers.authorization?.split(' ') ?? []; // Header named 'Authorization'
    // TODO: decode token and get userId.
    // ||= is in case we want to use parallel auth methods in the future to avoid overwriting userId.
    request.userId ||= authType === 'Bearer' ? token : undefined;

    return request.userId !== undefined;
  }
}
