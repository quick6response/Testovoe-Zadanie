import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { throws } from 'assert';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Post as PostModel } from './posts.model';
import { FindPostDto } from './dto/find-post.dto';
import { Attachment } from 'src/attachment/attachment-model';
import { UpdatePostDto } from './dto/update-post.dto';
@ApiBearerAuth()
@ApiTags('Блог')
@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}
  private readonly logger = new Logger(PostsController.name);

  @Post('/create')
  @ApiOperation({ summary: 'Создание блога' })
  @ApiResponse({ status: 200, type: PostModel })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  createPost(
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    dto.files = files;
    // временное решение, чтобы не пропускать не зарегистрированных
    if (!req.user.id)
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    return this.postService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получение блога пользователя' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @UseGuards(JwtAuthGuard)
  getPostUser(@Req() req: any) {
    return this.postService.getPostUser(req.user.id);
  }

  @Delete('/delete')
  @ApiOperation({ summary: 'Удаление поста из блога' })
  @ApiResponse({ status: 200, type: PostModel })
  @UseGuards(JwtAuthGuard)
  deletePostUser(@Body() post: FindPostDto, @Req() req: any) {
    return this.postService.deletePostUser(req.user.id, post);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Изменение поста в блоге' })
  @ApiResponse({ status: 200, type: PostModel })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  updatePost(
    @Body() dto: UpdatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    console.log(dto);
    dto.files = files ? files : [];
    if (!req.user) throw new UnauthorizedException('Не авторизован');
    return this.postService.updatePostUser(req.user.id, dto);
  }
}
