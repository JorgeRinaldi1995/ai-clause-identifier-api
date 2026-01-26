import { Injectable, Inject } from '@nestjs/common';
import type { EmbeddingProvider } from './embedding.interface';

@Injectable()
export class EmbeddingService {

  constructor(
    @Inject('EmbeddingProvider')
    private readonly provider: EmbeddingProvider,
  ) {}

  embed(text: string): Promise<number[]> {
    if (!text || text.length < 10) {
      throw new Error('Text too short for embedding');
    }

    return this.provider.embed(text);
  }
}
