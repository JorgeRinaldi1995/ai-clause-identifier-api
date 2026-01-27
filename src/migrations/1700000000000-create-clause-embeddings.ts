import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClauseEmbeddings1700000000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE clause_embeddings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        clause_text TEXT NOT NULL,
        embedding VECTOR(1536) NOT NULL,
        is_abusive BOOLEAN,
        created_at TIMESTAMP DEFAULT NOW()
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
    await queryRunner.query(`DROP TABLE clause_embeddings`);
  }
}
