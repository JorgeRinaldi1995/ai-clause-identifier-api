import { Module, forwardRef  } from '@nestjs/common';
import { BrazilianConsumerLawClausePrompt } from './prompts/clause-analysis.prompt';
import { ClauseAnalysisService } from './services/clause-analysis.service';
import { ClauseAnalysisResultRepository } from './repositories/clause-analysis-result.repository';
import { OpenAiAdapter } from '../traits/openai.adapter';
import { EmbeddingModule } from '../embedding/embedding.module';

@Module({
  imports: [EmbeddingModule],
  providers: [
    ClauseAnalysisService,
    BrazilianConsumerLawClausePrompt,
    ClauseAnalysisResultRepository,
    OpenAiAdapter
  ],
  exports: [ClauseAnalysisService],
})
export class AnalysisModule {}

