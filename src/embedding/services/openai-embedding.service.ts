import { Injectable } from '@nestjs/common';
import type { EmbeddingProvider } from './embedding.interface';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class OpenAiEmbeddingService implements EmbeddingProvider {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const openai = this.configService.get('openai');

    this.endpoint = openai.endpoint;
    this.apiKey = openai.apiKey;
    this.model = openai.embeddingModel;
  }

  async embed(text: string): Promise<number[]> {

    if (!text || text.length < 10) {
      throw new Error('Text too short for embedding');
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Embedding error', error);
      throw new Error('Failed to generate embedding');
    }

    const data = await response.json();

    return data.data[0].embedding;
  }
}
