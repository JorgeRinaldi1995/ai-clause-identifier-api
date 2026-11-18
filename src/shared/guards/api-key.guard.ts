import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedKey = this.configService.get<string>('security.apiKey');

    if (!expectedKey) {
      throw new UnauthorizedException('API key not configured on server');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.header('x-api-key');

    if (!providedKey || !this.matches(providedKey, expectedKey)) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }

  private matches(provided: string, expected: string): boolean {
    const providedBuf = Buffer.from(provided);
    const expectedBuf = Buffer.from(expected);

    if (providedBuf.length !== expectedBuf.length) {
      return false;
    }

    return timingSafeEqual(providedBuf, expectedBuf);
  }
}
