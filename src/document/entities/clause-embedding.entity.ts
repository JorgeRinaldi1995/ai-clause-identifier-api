import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('clause_embeddings')
export class ClauseEmbeddingEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  clauseText: string;

  /**
   * pgvector
   * 1536 → text-embedding-3-small
   */
  @Column({
    type: 'vector',
    length: 1536,
  })
  embedding: number[];

  @Column({ type: 'boolean', nullable: true })
  isAbusive?: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
