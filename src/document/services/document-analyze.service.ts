import { Injectable } from '@nestjs/common';
import { PopplerPdfToImageService } from './poppler-pdf-to-image.service';
import { TesseractOcrService } from './tesseract-ocr.service';
import { TextNormalizationService } from './text-normalization.service';
import { ClauseProcessingService } from '../../clause/services/clause-processing.service';

@Injectable()
export class DocumentAnalyzeService {
  constructor(
    private readonly pdfToImage: PopplerPdfToImageService,
    private readonly ocrService: TesseractOcrService,
    private readonly textNormalization: TextNormalizationService,
    private readonly clauseProcessingService: ClauseProcessingService,
  ) {}

  async analyze(pdfPath: string) {

    const images = await this.pdfToImage.convert(pdfPath);

    const rawText = await this.ocrService.extractText(images);

    const normalizedText = this.textNormalization.normalize(rawText);

    const clauses = this.textNormalization.chunkByClauses(normalizedText);

    const results: {
      id: string;
      preview: string;
      status: 'reused' | 'new';
      similarity?: number;
    }[] = [];

    for (const clause of clauses) {
      const result = await this.clauseProcessingService.process(clause.text);

      if (!result) continue;

      results.push({
        id: result.clauseId,
        preview: clause.text.substring(0, 120),
        status: result.status,
        similarity: result.similarity,
      });
    }

    return {
      clausesProcessed: results.length,
      clauses: results,
    };
  }
}
