import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

      return '/' + fileName;
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(file) {
    try {
      const fileName = file.slice(1);
      const filePath = path.resolve(__dirname, '..', 'static');

      console.log(path.resolve(filePath, fileName));
      fs.unlinkSync(path.resolve(filePath, fileName));
      return true;
      // fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
