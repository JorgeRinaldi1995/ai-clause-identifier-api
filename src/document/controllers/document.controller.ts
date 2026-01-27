import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentAnalyzeService } from '../services/document-analyze.service';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentAnalyzeService: DocumentAnalyzeService,
  ) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyze(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('PDF not provided');
    }

    return this.documentAnalyzeService.analyze(file.path);
  }
}