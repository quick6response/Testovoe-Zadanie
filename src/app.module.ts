import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/posts.model';
import { FilesModule } from './files/files.module';
import { Attachment } from './attachment/attachment-model';
import { UsersModule } from './users/users.module';
import { join, resolve } from 'path';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      exclude: ['/api*'],
      rootPath: resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      // port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Post, Attachment],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    FilesModule,
  ],
})
export class AppModule {}
