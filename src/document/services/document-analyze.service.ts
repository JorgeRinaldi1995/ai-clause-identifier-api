import { Injectable } from '@nestjs/common';
import { PopplerPdfToImageService } from './poppler-pdf-to-image.service';
import { TesseractOcrService } from './tesseract-ocr.service';
import { TextNormalizationService } from './text-normalization.service';
import { EmbeddingService } from '../../embedding/services/embedding.service';

@Injectable()
export class DocumentAnalyzeService {
  constructor(
    private readonly pdfToImage: PopplerPdfToImageService,
    private readonly ocrService: TesseractOcrService,
    private readonly textNormalization: TextNormalizationService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async analyze(pdfPath: string) {
    // 1️⃣ PDF → imagens
    const images = await this.pdfToImage.convert(pdfPath);

    // 2️⃣ OCR → texto bruto
    const rawText = await this.ocrService.extractText(images);

    // 3️⃣ Normalização
    const normalizedText = this.textNormalization.normalize(rawText);

    // 4️⃣ Chunk por cláusulas
    const clauses = this.textNormalization.chunkByClauses(normalizedText);

    // 5️⃣ Embeddings
    return Promise.all(
      clauses.map(async (clause) => ({
        ...clause,
        embedding: await this.embeddingService.embed(clause.text),
      })),
    );
  }
}
