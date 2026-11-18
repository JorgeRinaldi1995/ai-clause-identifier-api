import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PopplerPdfToImageService } from './poppler-pdf-to-image.service';
import { TesseractOcrService } from './tesseract-ocr.service';
import { TextNormalizationService } from './text-normalization.service';
import { ClauseProcessingService } from '../../analysis/services/clause-processing.service';

@Injectable()
export class DocumentAnalyzeService {
  constructor(
    private readonly pdfToImage: PopplerPdfToImageService,
    private readonly ocrService: TesseractOcrService,
    private readonly textNormalization: TextNormalizationService,
    private readonly clauseProcessingService: ClauseProcessingService,
  ) {}

  async analyze(pdfPath: string) {
    let outputDir: string | undefined;

    try {
      const converted = await this.pdfToImage.convert(pdfPath);
      outputDir = converted.outputDir;

      const rawText = await this.ocrService.extractText(converted.images);

      const normalizedText = this.textNormalization.normalize(rawText);

      const clauses = this.textNormalization.chunkByClauses(normalizedText);

      const settled = await Promise.allSettled(
        clauses.map((clause) =>
          this.clauseProcessingService.process(clause.text),
        ),
      );

      const results: Awaited<ReturnType<ClauseProcessingService['process']>>[] =
        [];
      const errors: string[] = [];

      for (const r of settled) {
        if (r.status === 'fulfilled') {
          results.push(r.value);
        } else {
          errors.push(
            r.reason instanceof Error ? r.reason.message : String(r.reason),
          );
        }
      }

      return {
        clausesProcessed: results.length,
        clausesFailed: errors.length,
        clauses: results,
        errors,
      };
    } finally {
      if (outputDir) {
        await this.pdfToImage.cleanup(outputDir);
      }
      await fs.promises.unlink(pdfPath).catch(() => {});
    }
  }
}
