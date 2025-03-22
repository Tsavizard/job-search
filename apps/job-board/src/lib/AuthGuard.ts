import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // TODO: Implement authenticator to decrypt 'token' and verify the user
    // Read userId from the cookies
    const userId = request.cookies['authToken']; // Cookie named 'userId'

    if (!userId) {
      return false;
    }

    request.userId = userId; // Set userId to the request object for further use
    return true;
  }
}
