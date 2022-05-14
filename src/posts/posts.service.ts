import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesService, FileType } from '../files/files.service';
import { Attachment } from 'src/attachment/attachment-model';
import { AttachmentService } from 'src/attachment/attachment.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { FindPostDto } from './dto/find-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    @InjectModel(User) private userRepository: typeof User,
    private attachService: AttachmentService,
    private userService: UsersService,
    private fileService: FilesService,
  ) {}
  private logger = new Logger(PostsService.name);

  async create(userId: number, dto: CreatePostDto) {
    try {
      const arrayAttachment = new Array(dto.files.length);
      const user = await this.userService.getUserById(userId);
      const post = await this.postRepository.create({
        title: dto.title,
        content: dto.content,
      });
      user.$add('post', post.id);
      // загружаем и создаем записи для каждого вложения
      if (dto.files.length && dto.files.length >= 1) {
        dto.files.forEach(async (file) => {
          // сохраняем картинку на пк
          const fileName = await this.fileService.createFile(file);
          // сохраняем имя картинки в базу
          const attachment = await this.attachService.create(fileName);
          user.$add('attachment', attachment.id);
          post.$add('attachment', attachment.id);
        });
      }
      return post;
    } catch (err) {
      this.logger.error(
        `Ошибка создания поста. Текст: ${err.message} Stack: ${err.stack}`,
      );
      throw new BadGatewayException(
        `Ошибка создания поста. Текст: ${err.message}`,
      );
    }
  }

  async getPostUser(userId: number) {
    const user = await this.postRepository.findAll({
      where: { userId: userId },
      include: [
        {
          model: Attachment,
        },
      ],
    });

    return user;
  }

  async deletePostUser(userId: number, postDto: FindPostDto) {
    const post: Post = await this.postRepository.findByPk(postDto.id, {
      include: [Attachment],
    });
    if (!post || post.userId !== userId)
      throw new NotFoundException(`Пост под номером ${postDto.id} не найден.`);
    // if (post.userId !== userId)
    //   throw new NotFoundException(
    //     `Пост под номером ${postDto.id} не найден у вас.`,
    //   );

    // удаляем вложения
    if (post.attachment.length && post.attachment.length > 1) {
      post.attachment.forEach(async (attachment) => {
        const attachmentDelete = await this.attachService.delete(attachment.id);
        await this.fileService.deleteFile(attachment.name);
      });
    }
    await post.destroy();

    console.log(post);

    return post;
  }

  // удалить вложения к посту
  async deleteAttachmentPostUser(userId: number, postId: number) {
    const post: Post = await this.postRepository.findByPk(postId, {
      include: [Attachment],
    });
    if (!post)
      throw new NotFoundException(`Пост под номером ${postId} не найден.`);
    if (post.userId !== userId)
      throw new NotFoundException(
        `Пост под номером ${postId} не найден у вас.`,
      );

    // удаляем вложения
    if (post.attachment.length && post.attachment.length > 1) {
      post.attachment.forEach(async (attachment) => {
        const attachmentDelete = await this.attachService.delete(attachment.id);
        await this.fileService.deleteFile(attachment.name);
      });
    }
    return post;
  }

  async updatePostUser(userId: number, dto: UpdatePostDto) {
    const post = await this.postRepository.findByPk(dto.postId, {
      include: [Attachment],
    });
    const user = await this.userService.getUserById(userId);
    if (!post || !user || post.userId !== userId)
      throw new NotFoundException(
        `Пост под номером ${dto.postId} не найден у вас.`,
      );

    // удаляем старые вложения если были загружены новые (временное решение, потом можно добавить к существующим)
    if (
      post.attachment.length &&
      post.attachment.length > 1 &&
      dto.files.length &&
      dto.files.length >= 1
    ) {
      await this.deleteAttachmentPostUser(userId, dto.postId);
    }
    // загружаем новые если есть
    if (dto.files.length && dto.files.length >= 1) {
      dto.files.forEach(async (file) => {
        // сохраняем картинку на пк
        const fileName = await this.fileService.createFile(file);
        // сохраняем имя картинки в базу
        const attachment = await this.attachService.create(fileName);
        user.$add('attachment', attachment.id);
        post.$add('attachment', attachment.id);
      });
    }
    // проверка на изменение содержания
    const title = post.title != dto.title ? dto.title : post.title;
    const content = post.content != dto.content ? dto.content : post.content;
    await post.update({
      title: title,
      content: content,
    });

    const postNew = await this.postRepository.findByPk(dto.postId, {
      include: [Attachment],
    });

    return postNew;
  }
}
