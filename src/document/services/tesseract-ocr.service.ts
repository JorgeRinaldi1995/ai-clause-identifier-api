import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { OcrInterface } from '../interfaces/ocr.interface';

@Injectable()
export class TesseractOcrService implements OcrInterface {

  async extractText(images: string[]): Promise<string> {

    let text = '';

    for (const image of images) {
      const outputBase = path.join('/tmp', `ocr_${Date.now()}`);

      const command = `tesseract "${image}" "${outputBase}" -l por`;

      await this.exec(command);

      text += fs.readFileSync(`${outputBase}.txt`, 'utf8') + '\n';
    }

    return text.trim();
  }

  private exec(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
        }
        resolve();
      });
    });
  }
}
