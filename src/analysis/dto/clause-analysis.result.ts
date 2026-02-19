export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export class ClauseAnalysisResult {
  clauseId!: string;

  isAbusive!: boolean;

  riskLevel!: RiskLevel;

  explanation!: string;

  violatedPrinciples?: string[];

  confidence!: number;

  category!: string;

}
