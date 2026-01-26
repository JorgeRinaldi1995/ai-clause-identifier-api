import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { PdfToImageInterface } from './pdf-to-image.interface';

@Injectable()
export class PopplerPdfToImageService implements PdfToImageInterface {

  async convert(pdfPath: string): Promise<string[]> {
    if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size === 0) {
        console.log(pdfPath);
      throw new Error('PDF inválido');
    }
    console.log('Pdf path --->', pdfPath);
    const outputDir = path.join('/tmp', `pdf_${Date.now()}`);
    console.log('Output ---->', outputDir);
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPrefix = path.join(outputDir, 'page');

    const command = `pdftoppm -png "${pdfPath}" "${outputPrefix}"`;
    console.log('Command ---->', command);
    await this.exec(command);

    const images = fs
      .readdirSync(outputDir)
      .filter(f => f.endsWith('.png'))
      .map(f => path.join(outputDir, f));

    if (images.length === 0) {
      throw new Error('Nenhuma imagem gerada');
    }

    return images;
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
