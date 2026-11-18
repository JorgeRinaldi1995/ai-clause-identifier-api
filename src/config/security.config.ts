import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  apiKey: process.env.API_KEY,
}));
