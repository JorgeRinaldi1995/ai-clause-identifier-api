import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('clause_analysis')
export class ClauseAnalysisEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  clauseId: string;

  @Column('jsonb')
  result: any;

  @CreateDateColumn()
  createdAt: Date;
}
