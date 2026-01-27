export interface OcrInterface {
  extractText(images: string[]): Promise<string>;
}
