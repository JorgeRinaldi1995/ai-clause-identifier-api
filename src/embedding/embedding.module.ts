import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmbeddingService } from './services/embedding.service';
import { OpenAiEmbeddingService } from './services/openai-embedding.service';

import { ClauseEmbeddingRepository } from './repositories/clause-embedding.repository';

@Module({
  providers: [
    EmbeddingService,
    ClauseEmbeddingRepository,
    {
      provide: 'EmbeddingProvider',
      useClass: OpenAiEmbeddingService,
    },
  ],
  exports: [
    EmbeddingService,
    ClauseEmbeddingRepository,
    'EmbeddingProvider',
  ],
})
export class EmbeddingModule {}
