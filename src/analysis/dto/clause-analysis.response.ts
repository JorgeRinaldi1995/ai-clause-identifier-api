import { ClauseAnalysisResult } from "../dto/clause-analysis.result";

export type AnalysisStatus = 'new' | 'reused';

export interface ClauseAnalysisResponse {
  status: AnalysisStatus;
  similarity?: number | null;
  analysis: ClauseAnalysisResult;
}
