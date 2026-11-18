import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { DocumentController } from './controllers/document.controller';

import { PopplerPdfToImageService } from './services/poppler-pdf-to-image.service';
import { TesseractOcrService } from './services/tesseract-ocr.service';
import { TextNormalizationService } from './services/text-normalization.service';
import { DocumentAnalyzeService } from './services/document-analyze.service';
import { FileStorageService } from './services/file-storage.service';

import { AnalysisModule } from '../analysis/analysis.module';

@Module({
  imports: [
    AnalysisModule,
    MulterModule.registerAsync({
      useFactory: () => new FileStorageService().getMulterOptions(),
    }),
  ],
  controllers: [DocumentController],
  providers: [
    DocumentAnalyzeService,
    PopplerPdfToImageService,
    TesseractOcrService,
    TextNormalizationService,
    FileStorageService,
  ],
})
export class DocumentModule {}
