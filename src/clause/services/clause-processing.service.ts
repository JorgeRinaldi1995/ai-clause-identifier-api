import { Injectable } from '@nestjs/common';
import { EmbeddingService } from 'src/embedding/services/embedding.service';
import { ClauseDeduplicationService } from 'src/deduplication/services/clause-deduplication.service';
import { ClauseEmbeddingRepository } from 'src/clause/repositories/clause-embedding.repository';
import { ClauseAnalysisService } from 'src/analysis/services/clause-analysis.service';

@Injectable()
export class ClauseProcessingService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly deduplicationService: ClauseDeduplicationService,
    private readonly clauseRepo: ClauseEmbeddingRepository,
    private readonly clauseAnalysisService: ClauseAnalysisService,
  ) {}

  async process(text: string) {
    if (!text || text.trim().length < 20) {
      throw new Error('Clause text too short');
    }
    

    // 1. Embedding
    const embedding = await this.embeddingService.embed(text);

    // 2. Deduplicação
    const reuse = await this.deduplicationService.findReusableClause(embedding);

    if (reuse.reusable) {
      return {
        status: 'reused',
        clauseId: reuse.clauseId!,
        similarity: reuse.similarity!,
      };
    }

    // 3. Persistir cláusula
    const savedClause = await this.clauseRepo.saveClause(text, embedding);

    // 4. IA
    const analysis = await this.clauseAnalysisService.analyze({
      text,
    });
    console.log('Result:::::', analysis);
    return {
      status: 'analyzed',
      clauseId: savedClause.id,
      analysis,
    };
  }
}
