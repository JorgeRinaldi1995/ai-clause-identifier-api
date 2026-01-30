import { ClauseAnalysisResult } from '../dto/clause-analysis.result';

export interface ClauseAnalysisProvider {
  analyze(clauseText: string): Promise<ClauseAnalysisResult>;
}
