import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
