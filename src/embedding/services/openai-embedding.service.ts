import { Injectable } from '@nestjs/common';
import type { EmbeddingProvider } from './embedding.interface';

@Injectable()
export class OpenAiEmbeddingService implements EmbeddingProvider {
  private readonly endpoint = 'https://api.openai.com/v1/embeddings';

  async embed(text: string): Promise<number[]> {
    console.log('Text on embed method ::::', text);
    if (!text || text.length < 10) {
      throw new Error('Text too short for embedding');
    }
    
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
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
