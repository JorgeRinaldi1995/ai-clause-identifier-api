export class ClauseAnalysisResult {
  clauseId: string;

  abusive: boolean;

  riskLevel: 'low' | 'medium' | 'high';

  justification: string;

  violatedPrinciples?: string[];

  confidence: number; 

  model: string;
}
