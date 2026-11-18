import { ClauseAnalysisRequest } from '../dto/clause-analysis.request';
import { ClauseAnalysisResponse } from '../dto/clause-analysis.response';

export abstract class ClauseAnalysisProvider {
  abstract analyze(
    request: ClauseAnalysisRequest,
  ): Promise<ClauseAnalysisResponse>;
}
