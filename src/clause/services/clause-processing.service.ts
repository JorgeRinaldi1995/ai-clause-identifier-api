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
    if (text.length < 20) return null;

    // 1. Embedding
    const embedding = await this.embeddingService.embed(text);

    // 2. Deduplicação
    const dedup = await this.deduplicationService.findReusableClause(embedding);

    if (dedup.reusable) {
      return {
        status: 'reused' as const,
        clauseId: dedup.sourceClauseId!,
        similarity: dedup.similarity,
      };
    }

    // 3. Persistir cláusula
    const savedClause = await this.clauseRepo.saveClause(text, embedding);

    // 4. IA
    const analysis = await this.clauseAnalysisService.analyze({
      clauseId: savedClause.id,
      text,
    });
    console.log('Result:::::', analysis);
    return {
      status: 'new' as const,
      clauseId: savedClause.id,
      analysis,
    };
  }
}
