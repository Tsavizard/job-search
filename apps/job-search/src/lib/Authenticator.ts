import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import assert from 'node:assert';

export class Authenticator {
  private readonly secret: string;
  constructor(configService: ConfigService) {
    assert(configService.get('AUTH_SECRET'));
    this.secret = configService.get('AUTH_SECRET') as string;
  }
  createAuthToken(userId: string) {
    const token = `${userId}.${crypto.randomBytes(16).toString('hex')}`; // Unique token for the user
    const signature = crypto
      .createHmac('sha3-512', this.secret)
      .update(token)
      .digest('hex'); // HMAC using SHA3-512
    return `${token}.${signature}`; // Return the token with its signature
  }

  verifyAuthToken(token: string) {
    const [userId, randomPart, signature] = token.split('.');
    const expectedSignature = crypto
      .createHmac('sha3-512', this.secret)
      .update(`${userId}.${randomPart}`)
      .digest('hex');
    const isValidToken = signature === expectedSignature;
    return {
      isValidToken,
      userId: isValidToken ? userId : null,
    };
  }
}
