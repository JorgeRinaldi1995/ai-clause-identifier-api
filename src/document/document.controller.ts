import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PopplerPdfToImageService } from './services/poppler-pdf-to-image.service';
import { TesseractOcrService } from './services/tesseract-ocr.service';
import { TextNormalizationService } from './services/text-normalization.service';
import { EmbeddingService } from '../embedding/services/embedding.service';

import * as path from 'path';
import * as fs from 'fs';

@Controller('document')
export class DocumentController {

  constructor(
    private readonly pdfToImage: PopplerPdfToImageService,
    private readonly ocrService: TesseractOcrService,
    private readonly textNormalization: TextNormalizationService,
    private readonly embeddingService: EmbeddingService
  ) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: '/tmp/uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `upload_${Date.now()}${ext}`);
      },
    }),
  }))
  async analyze(@UploadedFile() file: Express.Multer.File) {
    if (!file?.path) {
      throw new BadRequestException('PDF not provided');
    }

    // 1️⃣ PDF → imagens
    const images = await this.pdfToImage.convert(file.path);

    // 2️⃣ OCR → texto bruto
    const rawText = await this.ocrService.extractText(images);

    // 3️⃣ Normalização
    const normalizedText = this.textNormalization.normalize(rawText);

    // 4️⃣ Chunk por cláusulas (pronto pra embeddings / IA)
    const clauses = this.textNormalization.chunkByClauses(normalizedText);

    for (const clause of clauses) {
        const embedding = await this.embeddingService.embed(clause.text);
        console.log('Controller Embedding:', embedding);
    }

    // (opcional) limpeza de arquivos temporários
    this.cleanupFiles([file.path, ...images]);

    return {
      normalizedText,
      clauses,
      totalClauses: clauses.length,
    };
  }

  private cleanupFiles(files: string[]) {
    for (const file of files) {
      try {
        fs.unlinkSync(file);
      } catch (_) {}
    }
  }
}
