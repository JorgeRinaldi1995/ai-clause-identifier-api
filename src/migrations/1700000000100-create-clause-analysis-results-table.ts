import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClauseAnalysisResultsTable1700000000100
  implements MigrationInterface {

  name = 'CreateClauseAnalysisResultsTable1700000000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TABLE clause_analysis_results (
        result_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        clause_id uuid NOT NULL,
        category varchar(100),
        is_abusive boolean,
        risk_level varchar(50),
        confidence numeric,
        explanation text,
        violated_principles text[],
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_clause_analysis_results_clause
          FOREIGN KEY (clause_id)
          REFERENCES clause_analysis (id)
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
