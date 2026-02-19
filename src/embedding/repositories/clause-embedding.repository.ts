import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class ClauseEmbeddingRepository {
    constructor(private readonly dataSource: DataSource) {}

    async saveClause(
        text: string,
        embedding: number[],
        model: string,
    ) {
        const contentHash = crypto
        .createHash('sha256')
        .update(text)
        .digest('hex');

        const vectorString = `[${embedding.join(',')}]`;

        const result = await this.dataSource.query(
            `
            INSERT INTO clause_embeddings
                (clause_text, embedding, model, content_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [text, vectorString, model, contentHash],
        );

        return result[0];
    }

    async findSimilar(
        embedding: number[],
    ): Promise<{ id: string; similarity: number } | null> {
        const vectorString = `[${embedding.join(',')}]`;

        const result = await this.dataSource.query(
        `
        SELECT
            id,
            1 - (embedding <=> $1) AS similarity
        FROM clause_embeddings
        ORDER BY embedding <=> $1
        LIMIT 1;
        `,
        [vectorString],
        );

        if (!result.length) return null;

        return result[0];
    }
}
