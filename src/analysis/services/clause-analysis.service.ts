import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ClauseAnalysisProvider } from '../interfaces/clause-analysis.interface';
import { ClauseAnalysisRequest } from '../dto/clause-analysis.request';
import { ClauseAnalysisLlmOutputDto } from '../dto/clause-analysis-llm-output.dto';
import { ClauseEmbeddingRepository } from '../repositories/clause-embedding.repository';
import { BrazilianConsumerLawClausePrompt } from '../prompts/clause-analysis.prompt';
import { ClauseAnalysisResultRepository } from '../repositories/clause-analysis-result.repository';
import { OpenAiChatAdapter } from './openai-chat.adapter';
import { ClauseAnalysisResponse } from '../dto/clause-analysis.response';

@Injectable()
export class ClauseAnalysisService implements ClauseAnalysisProvider {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly similarityThreshold = 0.88;

  constructor(
    private readonly configService: ConfigService,
    private readonly prompt: BrazilianConsumerLawClausePrompt,
    private readonly resultRepo: ClauseAnalysisResultRepository,
    private readonly embeddingRepo: ClauseEmbeddingRepository,
    private readonly openAiAdapter: OpenAiChatAdapter,
  ) {
    const openai = this.configService.get('openai');
    this.endpoint = openai.chatEndpoint;
    this.apiKey = openai.apiKey;
    this.model = 'gpt-4.1';
  }

  async analyze(
    params: ClauseAnalysisRequest,
  ): Promise<ClauseAnalysisResponse> {
    // 🔎 1. Verificar similaridade
    const similar = await this.embeddingRepo.findSimilar(params.embedding);

    if (
      similar &&
      similar.similarity > this.similarityThreshold &&
      similar.id !== params.clauseId
    ) {
      const reused = await this.resultRepo.findLatestByClauseId(similar.id);

      if (reused) {
        return {
          status: 'reused',
          similarity: similar.similarity,
          analysis: reused,
        };
      }
    }

    // 🆕 2. Nova análise via IA
    const content = await this.openAiAdapter.chat(
      this.endpoint,
      this.apiKey,
      this.model,
      this.prompt.system(),
      this.prompt.user(params.text),
    );

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new BadGatewayException('Invalid JSON from OpenAI');
    }

    const validated = await this.validateLlmOutput(parsed);

    // 💾 Persistir resultado
    await this.resultRepo.saveAnalysisResult({
      clauseId: params.clauseId,
      category: validated.category,
      isAbusive: validated.isAbusive,
      riskLevel: validated.riskLevel,
      confidence: validated.confidence,
      explanation: validated.explanation,
      violatedPrinciples: validated.violatedPrinciples,
      model: this.model,
    });

    const persisted = await this.resultRepo.findLatestByClauseId(
      params.clauseId,
    );

    return {
      status: 'new',
      similarity: null,
      analysis: persisted,
    };
  }

  private async validateLlmOutput(
    parsed: unknown,
  ): Promise<ClauseAnalysisLlmOutputDto> {
    if (typeof parsed !== 'object' || parsed === null) {
      throw new BadGatewayException('Malformed analysis payload from OpenAI');
    }

    const instance = plainToInstance(ClauseAnalysisLlmOutputDto, parsed);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });

    if (errors.length > 0) {
      throw new BadGatewayException(
        `Malformed analysis payload from OpenAI: ${errors
          .map((e) => Object.values(e.constraints ?? {}).join(', '))
          .join('; ')}`,
      );
    }

    return instance;
  }
}
