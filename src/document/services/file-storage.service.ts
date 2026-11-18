import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const UPLOAD_DIR = '/tmp/uploads';

@Injectable()
export class FileStorageService {
  constructor() {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  getMulterOptions() {
    return {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('pdf')) {
          return cb(new Error('Only PDF files allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    };
  }
}
