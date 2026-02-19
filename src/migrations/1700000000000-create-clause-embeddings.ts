import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClauseEmbeddings1700000000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS vector;
    `);

    await queryRunner.query(`
      CREATE TABLE clause_embeddings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        clause_text TEXT NOT NULL,

        embedding VECTOR(1536) NOT NULL,

        model VARCHAR(100) NOT NULL,

        content_hash VARCHAR(64) NOT NULL UNIQUE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX clause_embedding_idx
      ON clause_embeddings
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS clause_embeddings`);
  }
}

