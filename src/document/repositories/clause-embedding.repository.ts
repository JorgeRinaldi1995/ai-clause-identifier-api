import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ClauseEmbeddingEntity } from '../entities/clause-embedding.entity';

@Injectable()
export class ClauseEmbeddingRepository {
    constructor(private readonly dataSource: DataSource) { }

    async saveClause(text: string, embedding: number[]) {
        const vectorLiteral = `[${embedding.join(',')}]`;
        
        const result = await this.dataSource.query(
            `
            INSERT INTO clause_embeddings (clause_text, embedding)
            VALUES ($1, $2::vector)
            RETURNING *
            `,
            [text, vectorLiteral],
        );

        return result[0];
    }

    async findSimilar(embedding: number[], limit = 5) {
        const vectorLiteral = `[${embedding.join(',')}]`;
        return this.dataSource.query(
            `
            SELECT *,
            1 - (embedding <=> $1) AS similarity
            FROM clause_embeddings
            ORDER BY embedding <=> $1
            LIMIT $2
            `,
            [vectorLiteral, limit],
        );
    }
}
