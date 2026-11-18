import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { RiskLevel } from './clause-analysis.result';

const RISK_LEVELS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH'];

export class ClauseAnalysisLlmOutputDto {
  @IsBoolean()
  isAbusive!: boolean;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence!: number;

  @IsString()
  @MaxLength(200)
  category!: string;

  @IsIn(RISK_LEVELS)
  riskLevel!: RiskLevel;

  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  violatedPrinciples: string[] = [];

  @IsString()
  @MaxLength(4000)
  explanation!: string;
}
