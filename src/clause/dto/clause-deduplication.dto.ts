// clause/dto/clause-deduplication.dto.ts

export class ClauseDeduplicationDto {
  isDuplicate: boolean;

  /**
   * Similaridade (ex: cosine similarity)
   */
  similarityScore?: number;

  /**
   * ID da cláusula similar encontrada
   */
  matchedClauseId?: string;
}
