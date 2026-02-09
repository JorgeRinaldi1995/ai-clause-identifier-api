import { Module } from '@nestjs/common';
import { BrazilianConsumerLawClausePrompt } from './prompts/clause-analysis.prompt';
import { ClauseAnalysisService } from './services/clause-analysis.service';
import { ClauseAnalysisRepository } from './repositories/clause-analysis.repository';
import { ClauseAnalysisRepositoryResult } from './repositories/clause-analysis-result.repository';

@Module({
  providers: [
    ClauseAnalysisService,
    BrazilianConsumerLawClausePrompt,
    ClauseAnalysisRepository,
    ClauseAnalysisRepositoryResult
  ],
  exports: [ClauseAnalysisService],
})
export class AnalysisModule {}

