import { Injectable } from '@nestjs/common';
import { EmbeddingProvider } from './embedding.interface';

@Injectable()
export class OpenAiEmbeddingService implements EmbeddingProvider {

  async embed(text: string): Promise<number[]> {
    console.log('Text on embed method ::::', text);
    // ⚠️ pseudo-client (intencional)
    const response = await fetch('https://models.inference.ai.azure.com/embeddings', {
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
