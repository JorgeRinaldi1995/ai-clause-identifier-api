import { Injectable } from '@nestjs/common';
import { EmbeddingService } from 'src/embedding/services/embedding.service';
import { ClauseEmbeddingRepository } from 'src/embedding/repositories/clause-embedding.repository';
import { ClauseAnalysisService } from 'src/analysis/services/clause-analysis.service';

@Injectable()
export class ClauseProcessingService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly clauseRepo: ClauseEmbeddingRepository,
    private readonly clauseAnalysisService: ClauseAnalysisService,
  ) {}

  async process(text: string) {
    if (!text || text.trim().length < 20) {
      throw new Error('Clause text too short');
    }
    

    // 1. Embedding
    const embedding = await this.embeddingService.embed(text);

    // 3. Persistir cláusula
    const savedClause = await this.clauseRepo.saveClause(
      text,
      embedding,
      'text-embedding-3-large',
    );


    // 4. IA
    const analysis = await this.clauseAnalysisService.analyze({
      clauseId: savedClause.id,
      text,
      embedding,
    });
    
    return {
      clauseId: savedClause.id,
      ...analysis,
    };
  }
}
