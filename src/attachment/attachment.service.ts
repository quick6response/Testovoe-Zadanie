import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, FileType } from '../files/files.service';
import { Attachment } from 'src/attachment/attachment-model';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectModel(Attachment) private attachRepository: typeof Attachment,
  ) {}

  async create(fileName: string): Promise<Attachment> {
    const attachmentCreate = await this.attachRepository.create({
      name: fileName,
    });
    return attachmentCreate;
  }

  async delete(attachId: number): Promise<number> {
    const attachmentDelete = await this.attachRepository.destroy({
      where: { id: attachId },
    });
    return attachmentDelete;
  }
}
