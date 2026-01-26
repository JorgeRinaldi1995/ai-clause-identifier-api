import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { PopplerPdfToImageService } from './services/poppler-pdf-to-image.service';
import { TesseractOcrService } from './services/tesseract-ocr.service';
import { TextNormalizationService } from './services/text-normalization.service';

@Module({
  controllers: [DocumentController],
  providers: [
    PopplerPdfToImageService,
    TesseractOcrService,
    TextNormalizationService,
  ],
})
export class DocumentModule {}
