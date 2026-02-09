import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClauseAnalysisProvider } from './clause-analysis.interface';
import { ClauseAnalysisResult } from '../dto/clause-analysis.result';
import { ClauseAnalysisRequest } from '../dto/clause-analysis.request';
import { BrazilianConsumerLawClausePrompt } from '../prompts/clause-analysis.prompt';
import { ClauseAnalysisRepository } from '../repositories/clause-analysis.repository';
import { ClauseAnalysisRepositoryResult } from '../repositories/clause-analysis-result.repository';

@Injectable()
export class ClauseAnalysisService
  implements ClauseAnalysisProvider {

  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly model: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prompt: BrazilianConsumerLawClausePrompt,
    private readonly clauseAnalysisRepo: ClauseAnalysisRepository,
    private readonly clauseAnalysisRepoResult: ClauseAnalysisRepositoryResult
  ) {
    const openai = this.configService.get('openai');
    this.endpoint = openai.chatEndpoint;
    this.apiKey = openai.apiKey;
    this.model = "gpt-4.1";
  }

  async analyze(
    request: ClauseAnalysisRequest
  ): Promise<ClauseAnalysisResult> {

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        temperature: 0.2,
        messages: [
          { role: 'system', content: this.prompt.system() },
          { role: 'user', content: this.prompt.user(request.text) },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status}`);
    }

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    let parsed: ClauseAnalysisResult;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error('Invalid JSON returned by OpenAI');
    }

    const analysis = await this.clauseAnalysisRepo.saveAnalysis(this.model);

    await this.clauseAnalysisRepoResult.saveAnalysisResult({
      clauseId: analysis.id,
      category: parsed.category,
      isAbusive: parsed.isAbusive,
      riskLevel: parsed.riskLevel,
      confidence: parsed.confidence,
      explanation: parsed.explanation,
      violatedPrinciples: parsed.violatedPrinciples ?? [],
    });

    return parsed;
  }

}