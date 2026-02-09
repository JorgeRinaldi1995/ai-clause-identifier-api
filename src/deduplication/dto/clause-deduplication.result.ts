export interface ClauseDeduplicationResult {
  clauseId?: string,
  reusable: boolean;
  similarity?: number;
}
