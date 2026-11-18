export interface EmbeddingProvider {
  readonly modelName: string;
  embed(text: string): Promise<number[]>;
}
