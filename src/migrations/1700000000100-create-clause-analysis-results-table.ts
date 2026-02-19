import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClauseAnalysisResultsTable1700000000100
  implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TABLE clause_analysis_results (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        clause_id UUID NOT NULL,

        category VARCHAR(100),

        is_abusive BOOLEAN,

        risk_level VARCHAR(50),

        confidence NUMERIC,

        explanation TEXT,

        violated_principles TEXT[],

        model VARCHAR(100) NOT NULL,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_clause_analysis_results_clause
          FOREIGN KEY (clause_id)
          REFERENCES clause_embeddings (id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
        CREATE INDEX idx_clause_analysis_results_clause
        ON clause_analysis_results (clause_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS clause_analysis_results;
    `);
  }
}
