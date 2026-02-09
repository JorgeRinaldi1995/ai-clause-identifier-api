import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ClauseAnalysisRepository {
    constructor(private readonly dataSource: DataSource) { }

    async saveAnalysis(model: string) {
        const [row] = await this.dataSource.query(
            `
        INSERT INTO clause_analysis ( model )
        VALUES ($1)
        RETURNING id, created_at
        `,
            [model],
        );

        return row;
    }

    async findByAnalysisId(analysisId: string) {
        const [row] = await this.dataSource.query(
            `
      SELECT result
      FROM clause_analysis
      WHERE id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
            [analysisId],
        );

        return row?.result ?? null;
    }
}
