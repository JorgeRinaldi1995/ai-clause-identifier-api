import { Injectable } from '@nestjs/common';
import { PopplerPdfToImageService } from './poppler-pdf-to-image.service';
import { TesseractOcrService } from './tesseract-ocr.service';
import { TextNormalizationService } from './text-normalization.service';
import { EmbeddingService } from '../../embedding/services/embedding.service';
import { ClauseEmbeddingRepository } from '../repositories/clause-embedding.repository';

@Injectable()
export class DocumentAnalyzeService {
  constructor(
    private readonly pdfToImage: PopplerPdfToImageService,
    private readonly ocrService: TesseractOcrService,
    private readonly textNormalization: TextNormalizationService,
    private readonly embeddingService: EmbeddingService,
    private readonly clauseRepo: ClauseEmbeddingRepository,
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

    const results: {
      id: string;
      preview: string;
    }[] = [];


    for (const clause of clauses) {
      if (clause.text.length < 20) continue;

       // 5️⃣ Embedding
      const embedding = await this.embeddingService.embed(clause.text);

      // 6️⃣ Persistência automática
      const saved = await this.clauseRepo.saveClause(
        clause.text,
        embedding,
      );

      results.push({
        id: saved.id,
        preview: clause.text.substring(0, 120),
      });
    }

    // 5️⃣ Embeddings
    return {
      clausesProcessed: results.length,
      clauses: results,
    };
  }
}
