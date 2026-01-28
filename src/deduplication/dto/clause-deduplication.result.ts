export interface ClauseDeduplicationResult {
  reusable: boolean;
  similarity?: number;
  sourceClauseId?: string;
}
