import { Injectable } from '@nestjs/common';
import { PopplerPdfToImageService } from './poppler-pdf-to-image.service';
import { TesseractOcrService } from './tesseract-ocr.service';
import { TextNormalizationService } from './text-normalization.service';
import { EmbeddingService } from '../../embedding/services/embedding.service';
import { ClauseEmbeddingRepository } from '../repositories/clause-embedding.repository';
import { ClauseDeduplicationService } from '../../deduplication/services/clause-deduplication.service';

@Injectable()
export class DocumentAnalyzeService {
  constructor(
    private readonly pdfToImage: PopplerPdfToImageService,
    private readonly ocrService: TesseractOcrService,
    private readonly textNormalization: TextNormalizationService,
    private readonly embeddingService: EmbeddingService,
    private readonly clauseRepo: ClauseEmbeddingRepository,
    private readonly deduplicationService: ClauseDeduplicationService,
  ) {}

  async analyze(pdfPath: string) {

    const images = await this.pdfToImage.convert(pdfPath);
    const rawText = await this.ocrService.extractText(images);
    console.log('Raw Text', rawText);

    const normalizedText = this.textNormalization.normalize(rawText);
    console.log('Normalized Text', normalizedText);

    const clauses = this.textNormalization.chunkByClauses(normalizedText);
    console.log('Clauses Chunk', clauses);

    const results: {
      id: string;
      preview: string;
      status: 'reused' | 'new';
      similarity?: number;
    }[] = [];

    for (const clause of clauses) {
      if (clause.text.length < 20) continue;

      const embedding = await this.embeddingService.embed(clause.text);
      console.log('Embeddings:::', embedding);

      const dedup = await this.deduplicationService.findReusableClause(embedding);
      console.log('Dedup:::', dedup);

      if (dedup.reusable) {
        results.push({
          id: dedup.sourceClauseId!,
          preview: clause.text.substring(0, 120),
          status: 'reused',
          similarity: dedup.similarity,
        });

        continue;
      }

      const saved = await this.clauseRepo.saveClause(
        clause.text,
        embedding,
      );

      console.log('Saved:::', saved);

      results.push({
        id: saved.id,
        preview: clause.text.substring(0, 120),
        status: 'new',
      });

      console.log('Final Results', results);
    }

    return {
      clausesProcessed: results.length,
      clauses: results,
    };
  }
}
