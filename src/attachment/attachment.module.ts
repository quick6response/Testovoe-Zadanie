import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Post } from '../posts/posts.model';
import { Attachment } from 'src/attachment/attachment-model';
import { AttachmentService } from './attachment.service';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  providers: [AttachmentService],
  imports: [SequelizeModule.forFeature([User, Post, Attachment])],
  exports: [AttachmentService],
})
export class AttachmentModule {}
