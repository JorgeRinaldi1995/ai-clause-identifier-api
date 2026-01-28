import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const api_key = this.configService.get<string>('API_KEY');
    const port = this.configService.get<number>('PORT');

    return 'Hello World!';
  }
}