import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClauseAnalysisTable1700000000000
  implements MigrationInterface {

  name = 'CreateClauseAnalysisTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TABLE clause_analysis (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        model varchar(100) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_clause_analysis_clause_id_created_at
      ON clause_analysis (id, created_at DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS clause_analysis;
    `);
  }
}
