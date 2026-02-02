import { Module } from '@nestjs/common';
import { BrazilianConsumerLawClausePrompt } from './prompts/clause-analysis.prompt';
import { ClauseAnalysisService } from './services/clause-analysis.service';

@Module({
  providers: [
    ClauseAnalysisService,
    BrazilianConsumerLawClausePrompt,
  ],
  exports: [ClauseAnalysisService],
})
export class AnalysisModule {}

