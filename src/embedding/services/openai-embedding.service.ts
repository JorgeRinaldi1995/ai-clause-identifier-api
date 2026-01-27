import { Injectable } from '@nestjs/common';
import type { EmbeddingProvider } from './embedding.interface';

@Injectable()
export class OpenAiEmbeddingService implements EmbeddingProvider {
  private readonly endpoint = 'https://api.openai.com/v1/embeddings';
  private readonly api_key = process.env.OPEN_AI_KEY

  async embed(text: string): Promise<number[]> {
    console.log('Text on embed method ::::', text);
    if (!text || text.length < 10) {
      throw new Error('Text too short for embedding');
    }
    
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Embedding error', error);
      throw new Error('Failed to generate embedding');
    }

    const data = await response.json();
    console.log('Open AI embedding service::::', data);

    return data.data[0].embedding;
  }
}
