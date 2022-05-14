import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Post } from 'src/posts/posts.model';
import { Attachment } from 'src/attachment/attachment-model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: [
        {
          model: Post,
          order: ['createAt', 'DESC'],
          include: [Attachment],
        },
      ],
    });
    return user;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: { all: true },
    });
    return user;
  }

  // async addPostUser(dto: AddRoleDto) {
  //   const user = await this.userRepository.findByPk(dto.userId);
  //   const role = await this.roleService.getRoleByValue(dto.value);
  //   if (role && user) {
  //     await user.$add('role', role.id);
  //     return dto;
  //   }
  //   throw new HttpException(
  //     'Пользователь или пост не найден',
  //     HttpStatus.NOT_FOUND,
  //   );
  // }
}
