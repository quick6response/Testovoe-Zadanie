import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    example: '1',
    description: 'ID Поста',
  })
  postId: number;

  @ApiProperty({
    example: 'Тестовый заголовок',
    description: 'Заголовок поста',
  })
  @Length(4, 50, {
    message: 'Заголовок должен быть больше 4 и меньше 50 символов',
  })
  readonly title: string;

  @ApiProperty({
    example:
      'Сегодня ровно в 09:00 утра, Разработчик устроился в компанию и стал счастлив.',
    description: 'Заголовок поста',
  })
  @Length(4, 300, {
    message: 'Содержание должен быть больше 4 и меньше 300 символов',
  })
  readonly content: string;

  @ApiProperty({
    example: [],
    isArray: true,
    required: false,
    type: 'object',
    description: 'Вложения к посту',
  })
  files?: Array<Express.Multer.File>;
}
