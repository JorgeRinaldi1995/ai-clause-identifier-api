export interface PdfToImageResult {
  images: string[];
  outputDir: string;
}

export interface PdfToImageInterface {
  convert(pdfPath: string): Promise<PdfToImageResult>;
  cleanup(outputDir: string): Promise<void>;
}
