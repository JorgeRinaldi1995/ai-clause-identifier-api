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
      status: 'reused' | 'analyzed';
      similarity?: number;
      analysis?: any 
    }[] = [];

    for (const clause of clauses) {
      const processingResult = await this.clauseProcessingService.process(clause.text);

      if (!processingResult) continue;

      if (processingResult.status === 'reused') {
        results.push({
          id: processingResult.clauseId,
          preview: clause.text.slice(0, 120),
          status: 'reused',
          similarity: processingResult.similarity,
        });
      }
      if (processingResult.status === 'analyzed') {
        results.push({
          id: processingResult.clauseId,
          preview: clause.text.slice(0, 120),
          status: 'analyzed',
          analysis: processingResult.analysis,
        });
      }
    }

    return {
      clausesProcessed: results.length,
      clauses: results,
    };
  }
}
