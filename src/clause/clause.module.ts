import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClauseProcessingService } from './services/clause-processing.service';
import { ClauseEmbeddingRepository } from '../embedding/repositories/clause-embedding.repository';

import { EmbeddingModule } from 'src/embedding/embedding.module';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  imports: [
    EmbeddingModule,
    AnalysisModule
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
