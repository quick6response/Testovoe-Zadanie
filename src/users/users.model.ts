import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../posts/posts.model';
import { Attachment } from 'src/attachment/attachment-model';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор пользователя',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({ example: 'user@mail.ru', description: 'Электронная почта' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
  @ApiProperty({ example: 'password', description: 'Зашифрованный пароль' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Attachment)
  attachments: Attachment[];
}
