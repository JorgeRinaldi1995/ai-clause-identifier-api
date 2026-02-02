import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClauseProcessingService } from './services/clause-processing.service';
import { ClauseEmbeddingRepository } from './repositories/clause-embedding.repository';
import { ClauseEmbeddingEntity } from './entities/clause-embedding.entity';

import { EmbeddingModule } from 'src/embedding/embedding.module';
import { DeduplicationModule } from 'src/deduplication/deduplication.module';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClauseEmbeddingEntity]),
    EmbeddingModule,
    DeduplicationModule,
    AnalysisModule,
  ],
  providers: [
    ClauseProcessingService,
    ClauseEmbeddingRepository,
  ],
  exports: [
    ClauseProcessingService,
  ],
})
export class ClauseModule {}
