import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { DocumentController } from './controllers/document.controller';

import { PopplerPdfToImageService } from './services/poppler-pdf-to-image.service';
import { TesseractOcrService } from './services/tesseract-ocr.service';
import { TextNormalizationService } from './services/text-normalization.service';
import { DocumentAnalyzeService } from './services/document-analyze.service';


import { FileStorageService } from 'src/storage/services/file-storage.service';
import { StorageModule  } from 'src/storage/storage.module';

import { EmbeddingModule } from 'src/embedding/embedding.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ClauseEmbeddingEntity } from './entities/clause-embedding.entity';

import { ClauseEmbeddingRepository } from './repositories/clause-embedding.repository';


@Module({
  imports: [
    StorageModule,
    EmbeddingModule,
    TypeOrmModule.forFeature([ClauseEmbeddingEntity]),
    MulterModule.registerAsync({
        imports: [StorageModule],
        inject: [FileStorageService],
        useFactory: (fileStorage: FileStorageService) =>
            fileStorage.getMulterOptions(),
    }),
  ],
  controllers: [DocumentController],
  providers: [
    DocumentAnalyzeService,
    ClauseEmbeddingRepository,
    PopplerPdfToImageService,
    TesseractOcrService,
    TextNormalizationService,
  ],
})
export class DocumentModule {}
