import { Module } from '@nestjs/common';
import { BrazilianConsumerLawClausePrompt } from './prompts/clause-analysis.prompt';
import { ClauseAnalysisService } from './services/clause-analysis.service';
import { ClauseProcessingService } from './services/clause-processing.service';
import { EmbeddingService } from './services/embedding.service';
import { OpenAiEmbeddingService } from './services/openai-embedding.service';
import { OpenAiChatAdapter } from './services/openai-chat.adapter';
import { ClauseAnalysisResultRepository } from './repositories/clause-analysis-result.repository';
import { ClauseEmbeddingRepository } from './repositories/clause-embedding.repository';

@Module({
  providers: [
    ClauseProcessingService,
    ClauseAnalysisService,
    BrazilianConsumerLawClausePrompt,
    ClauseAnalysisResultRepository,
    ClauseEmbeddingRepository,
    EmbeddingService,
    OpenAiChatAdapter,
    {
      provide: 'EmbeddingProvider',
      useClass: OpenAiEmbeddingService,
    },
  ],
  exports: [ClauseProcessingService],
})
export class AnalysisModule {}
