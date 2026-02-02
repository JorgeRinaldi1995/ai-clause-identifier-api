import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClauseAnalysisProvider } from './clause-analysis.interface';
import { ClauseAnalysisResult } from '../dto/clause-analysis.result';
import { ClauseAnalysisRequest } from '../dto/clause-analysis.request';
import { BrazilianConsumerLawClausePrompt } from '../prompts/clause-analysis.prompt';

@Injectable()
export class ClauseAnalysisService
  implements ClauseAnalysisProvider {

  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly model: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prompt: BrazilianConsumerLawClausePrompt,
  ) {
    const openai = this.configService.get('openai');
    this.endpoint = openai.chatEndpoint;
    this.apiKey = openai.apiKey;
    this.model = openai.chatModel;
  }
  
  async analyze(request: ClauseAnalysisRequest): Promise<ClauseAnalysisResult> {
    console.log('PROMPT:::::', this.prompt);
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
    console.log('Body:::::::::', response.body);
    if (!response.ok) {
      throw new Error('Failed to analyze clause');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('Analysis Content:::::::::::', content);
    return JSON.parse(content);
  }
}