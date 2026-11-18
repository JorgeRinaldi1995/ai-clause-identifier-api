import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { OcrInterface } from '../interfaces/ocr.interface';

@Injectable()
export class TesseractOcrService implements OcrInterface {
  async extractText(images: string[]): Promise<string> {
    let text = '';

    for (const image of images) {
      const outputBase = path.join(
        '/tmp',
        `ocr_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
      );
      const outputFile = `${outputBase}.txt`;

      try {
        await this.execFile('tesseract', [image, outputBase, '-l', 'por']);

        text += (await fs.promises.readFile(outputFile, 'utf8')) + '\n';
      } finally {
        await fs.promises.unlink(outputFile).catch(() => {});
      }
    }

    return text.trim();
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
