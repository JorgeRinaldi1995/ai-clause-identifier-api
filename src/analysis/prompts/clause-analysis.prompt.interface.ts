export interface ClauseAnalysisPrompt {
  system(): string;
  user(clauseText: string): string;
  version(): string;
}
