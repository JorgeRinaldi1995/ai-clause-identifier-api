import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ClauseAnalysisRepositoryResult {
  constructor(private readonly dataSource: DataSource) {}

  async saveAnalysisResult(data: {
    clauseId: string,
    category: string;
    isAbusive: boolean;
    riskLevel: string;
    confidence: number;
    explanation: string;
    violatedPrinciples: string[];
  }) {
    const [row] = await this.dataSource.query(
      `
      INSERT INTO clause_analysis_results (
        clause_id,
        category,
        is_abusive,
        risk_level,
        confidence,
        explanation,
        violated_principles
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING result_id, created_at
      `,
      [
        data.clauseId,
        data.category,
        data.isAbusive,
        data.riskLevel,
        data.confidence,
        data.explanation,
        data.violatedPrinciples,
      ],
    );

    return row;
  }

  async findResultByClauseId(clauseId: string) {
    const [row] = await this.dataSource.query(
      `
      SELECT
        category,
        is_abusive AS "isAbusive",
        risk_level AS "riskLevel",
        confidence,
        explanation,
        violated_principles AS "violatedPrinciples"
      FROM clause_analysis_results
      WHERE clause_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [clauseId],
    );

    return row ?? null;
  }
}
