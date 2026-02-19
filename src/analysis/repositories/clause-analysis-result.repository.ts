import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ClauseAnalysisResultRepository {
  constructor(private readonly dataSource: DataSource) {}

  async saveAnalysisResult(data: {
    clauseId: string;
    category: string;
    isAbusive: boolean;
    riskLevel: string;
    confidence: number;
    explanation: string;
    violatedPrinciples: string[];
    model: string;
  }) {
    await this.dataSource.query(
      `
      INSERT INTO clause_analysis_results
        (clause_id, category, is_abusive, risk_level,
         confidence, explanation, violated_principles, model)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8);
      `,
      [
        data.clauseId,
        data.category,
        data.isAbusive,
        data.riskLevel,
        data.confidence,
        data.explanation,
        data.violatedPrinciples,
        data.model,
      ],
    );
  }

  async findLatestByClauseId(clauseId: string) {
    const result = await this.dataSource.query(
      `
      SELECT *
      FROM clause_analysis_results
      WHERE clause_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
      `,
      [clauseId],
    );

    return result[0] ?? null;
  }
}
