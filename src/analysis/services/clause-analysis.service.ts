import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClauseAnalysisProvider } from './clause-analysis.interface';
import { ClauseAnalysisResult } from '../dto/clause-analysis.result';
import { ClauseAnalysisRequest } from '../dto/clause-analysis.request';
import { ClauseEmbeddingRepository } from 'src/embedding/repositories/clause-embedding.repository';
import { BrazilianConsumerLawClausePrompt } from '../prompts/clause-analysis.prompt';
import { ClauseAnalysisResultRepository } from '../repositories/clause-analysis-result.repository';
import { OpenAiAdapter } from '../../traits/openai.adapter';
import { ClauseAnalysisResponse } from '../dto/clause-analysis.response';

@Injectable()
export class ClauseAnalysisService
  implements ClauseAnalysisProvider {

  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly similarityThreshold = 0.88;

  constructor(
    private readonly configService: ConfigService,
    private readonly prompt: BrazilianConsumerLawClausePrompt,
    private readonly resultRepo: ClauseAnalysisResultRepository,
    private readonly embeddingRepo: ClauseEmbeddingRepository,
    private readonly openAiAdapter: OpenAiAdapter,
  ) {
    const openai = this.configService.get('openai');
    this.endpoint = openai.chatEndpoint;
    this.apiKey = openai.apiKey;
    this.model = 'gpt-4.1';
  }

  async analyze(
    params: ClauseAnalysisRequest
  ): Promise<ClauseAnalysisResponse> {


    // 🔎 1. Verificar similaridade
    const similar = await this.embeddingRepo.findSimilar(
      params.embedding,
    );

    if (
      similar &&
      similar.similarity > this.similarityThreshold &&
      similar.id !== params.clauseId
    ) {
      const reused =
        await this.resultRepo.findLatestByClauseId(similar.id);

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

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error('Invalid JSON from OpenAI');
    }

    // 💾 Persistir resultado
    await this.resultRepo.saveAnalysisResult({
      clauseId: params.clauseId,
      category: parsed.category,
      isAbusive: parsed.isAbusive,
      riskLevel: parsed.riskLevel,
      confidence: parsed.confidence,
      explanation: parsed.explanation,
      violatedPrinciples: parsed.violatedPrinciples ?? [],
      model: this.model,
    });

    const persisted =
      await this.resultRepo.findLatestByClauseId(params.clauseId);

    return {
      status: 'new',
      similarity: null,
      analysis: persisted,
    };
  }
}