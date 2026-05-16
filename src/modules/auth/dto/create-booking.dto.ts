import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsISO8601, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  partySize!: number;

  @ApiProperty({ example: '2026-06-20T19:00:00.000Z' })
  @IsISO8601()
  bookedFor!: string;
}
