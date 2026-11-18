import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  PdfToImageInterface,
  PdfToImageResult,
} from '../interfaces/pdf-to-image.interface';

@Injectable()
export class PopplerPdfToImageService implements PdfToImageInterface {
  async convert(pdfPath: string): Promise<PdfToImageResult> {
    if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size === 0) {
      throw new Error('PDF inválido');
    }

    const outputDir = path.join(
      '/tmp',
      `pdf_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
    );

    fs.mkdirSync(outputDir, { recursive: true });

    try {
      const outputPrefix = path.join(outputDir, 'page');

      await this.execFile('pdftoppm', ['-png', pdfPath, outputPrefix]);

      const images = fs
        .readdirSync(outputDir)
        .filter((f) => f.endsWith('.png'))
        .map((f) => path.join(outputDir, f));

      if (images.length === 0) {
        throw new Error('Nenhuma imagem gerada');
      }

      return { images, outputDir };
    } catch (error) {
      await this.cleanup(outputDir);
      throw error;
    }
  }

  async cleanup(outputDir: string): Promise<void> {
    await fs.promises.rm(outputDir, { recursive: true, force: true });
  }

  private execFile(command: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      execFile(command, args, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
          return;
        }
        resolve();
      });
    });
  }
}
