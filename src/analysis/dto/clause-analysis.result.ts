export interface ClauseAnalysisResult {
  isAbusive: boolean;
  confidence: number; // 0.0 → 1.0
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  legalBasis: string[];
  explanation: string;
}
