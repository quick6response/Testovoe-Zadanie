import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString } from 'class-validator';

export class FindPostDto {
  @ApiProperty({ example: '1', description: 'ID поста у человека в блоге' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly id: number;
}
