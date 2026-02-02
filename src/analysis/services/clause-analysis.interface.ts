import { ClauseAnalysisRequest } from '../dto/clause-analysis.request';
import { ClauseAnalysisResult } from '../dto/clause-analysis.result';

export abstract class ClauseAnalysisProvider {
  abstract analyze(
    request: ClauseAnalysisRequest,
  ): Promise<ClauseAnalysisResult>;
}
