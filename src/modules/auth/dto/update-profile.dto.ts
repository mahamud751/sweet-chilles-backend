import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMemberProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: '1990-05-15' })
  @IsOptional()
  @IsString()
  birthday?: string;
}

export class ChangeMemberPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  currentPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
