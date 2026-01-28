import { Module } from '@nestjs/common';
import { ClauseDeduplicationService } from './services/clause-deduplication.service';
import { ClauseEmbeddingRepository } from 'src/document/repositories/clause-embedding.repository';

@Module({
  providers: [
    ClauseDeduplicationService,
    ClauseEmbeddingRepository,
  ],
  exports: [
    ClauseDeduplicationService,
  ],
})
export class DeduplicationModule {}
