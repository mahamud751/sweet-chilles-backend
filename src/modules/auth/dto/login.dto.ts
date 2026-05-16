import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class MemberLoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;
}

export class MemberRegisterDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ required: false })
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: '1990-05-15' })
  @IsString()
  birthday?: string;

  @ApiProperty({ required: false, description: 'Competition entry id for voucher grant' })
  @IsString()
  competitionEntryId?: string;
}

export class StaffLoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}
