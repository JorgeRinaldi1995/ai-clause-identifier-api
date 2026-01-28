import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  apiKey: process.env.OPEN_AI_KEY,
  embeddingModel: 'text-embedding-3-small',
  endpoint: 'https://api.openai.com/v1/embeddings',
}));
