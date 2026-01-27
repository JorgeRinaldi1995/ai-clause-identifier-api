import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ClauseEmbeddingEntity } from '../entities/clause-embedding.entity';

@Injectable()
export class ClauseEmbeddingRepository {
    constructor(private readonly dataSource: DataSource) { }

    private toPgVector(vector: number[]): string {
        return `[${vector.join(',')}]`;
    }

    async saveClause(text: string, embedding: number[]) {
        const vector = this.toPgVector(embedding);

        const result = await this.dataSource.query(
            `
            INSERT INTO clause_embeddings (clause_text, embedding)
            VALUES ($1, $2::vector)
            RETURNING *
            `,
            [text, vector],
        );

        return result[0];
    }

    async findSimilar(embedding: number[], limit = 5) {
        return this.dataSource.query(
            `
      SELECT *,
      1 - (embedding <=> $1) AS similarity
      FROM clause_embeddings
      ORDER BY embedding <=> $1
      LIMIT $2
      `,
            [embedding, limit],
        );
    }
}
