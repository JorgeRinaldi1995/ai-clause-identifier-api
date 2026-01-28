import { Injectable } from '@nestjs/common';
import { ClauseEmbeddingRepository } from '../../document/repositories/clause-embedding.repository';
import { ClauseDeduplicationResult } from '../dto/clause-deduplication.result';

@Injectable()
export class ClauseDeduplicationService {
  /**
   * Threshold inicial seguro
   * Pode (e deve) ser ajustado após observar dados reais
   */
  private readonly SIMILARITY_THRESHOLD = 0.92;

  constructor(
    private readonly clauseRepo: ClauseEmbeddingRepository,
  ) {}

  async findReusableClause(
    embedding: number[],
  ): Promise<ClauseDeduplicationResult> {

    const results = await this.clauseRepo.findSimilar(embedding, 1);

    if (!results || results.length === 0) {
      return { reusable: false };
    }

    const bestMatch = results[0];

    if (bestMatch.similarity >= this.SIMILARITY_THRESHOLD) {
      return {
        reusable: true,
        similarity: bestMatch.similarity,
        sourceClauseId: bestMatch.id,
      };
    }

    return { reusable: false };
  }
}
