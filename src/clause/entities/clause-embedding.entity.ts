import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('clause_embeddings')
export class ClauseEmbeddingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'clause_text', type: 'text' })
  clause_text: string;

  /**
   * Usando pgvector (vector)
   * Ajuste a dimensão conforme o modelo de embedding
   * ex: 1536 (text-embedding-3-small)
   */
  @Column({
    type: 'vector',
    length: 1536,
  })
  embedding: number[];

  @CreateDateColumn()
  createdAt: Date;
}
