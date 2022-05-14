import { Logger, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Post } from './posts.model';
import { FilesModule } from '../files/files.module';
import { AuthModule } from 'src/auth/auth.module';
import { Attachment } from 'src/attachment/attachment-model';
import { UsersModule } from 'src/users/users.module';
import { AttachmentModule } from 'src/attachment/attachment.module';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [
    SequelizeModule.forFeature([User, Post, Attachment]),
    FilesModule,
    AuthModule,
    AttachmentModule,
    UsersModule,
  ],
})
export class PostsModule {}
