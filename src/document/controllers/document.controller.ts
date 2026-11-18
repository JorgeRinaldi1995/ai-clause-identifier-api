import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentAnalyzeService } from '../services/document-analyze.service';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentAnalyzeService: DocumentAnalyzeService,
  ) {}

  @Post('analyze')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseInterceptors(FileInterceptor('file'))
  async analyze(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('PDF not provided');
    }

    return this.documentAnalyzeService.analyze(file.path);
  }
}
