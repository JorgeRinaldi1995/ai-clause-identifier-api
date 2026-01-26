import { Module } from '@nestjs/common';
import { EmbeddingService } from './services/embedding.service';
import { OpenAiEmbeddingService } from './services/openai-embedding.service';

@Module({
  providers: [
    EmbeddingService,
    {
      provide: 'EmbeddingProvider',
      useClass: OpenAiEmbeddingService,
    },
  ],
  exports: [
    EmbeddingService,
    'EmbeddingProvider', 
  ],
})
export class EmbeddingModule {}
