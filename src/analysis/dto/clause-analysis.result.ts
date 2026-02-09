export class ClauseAnalysisResult {
  clauseId: string;

  isAbusive: boolean;

  riskLevel: "LOW" | "MEDIUM" | "HIGH";

  justification: string;

  violatedPrinciples?: string[];

  confidence: number;

  explanation: string;

  category: string;
}
