import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { AuthModule } from '../auth/auth.module';
import { Post } from '../posts/posts.model';
import { Attachment } from 'src/attachment/attachment-model';

@Module({
  controllers: [],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Post, Attachment]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
