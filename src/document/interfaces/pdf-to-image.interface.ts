export interface PdfToImageInterface {
  convert(pdfPath: string): Promise<string[]>;
}
