import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RestaurantBrandingDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'sweet-chillies' })
  slug!: string;

  @ApiProperty({ example: 'Sweet Chillies' })
  name!: string;

  @ApiProperty({ example: 'Sweet Chillies Members Club' })
  appDisplayName!: string;

  @ApiPropertyOptional()
  tagline?: string | null;

  @ApiProperty({ example: '#F15A24' })
  primaryColor!: string;

  @ApiPropertyOptional()
  logoUrl?: string | null;

  @ApiProperty({ example: 30 })
  welcomeDiscountPercent!: number;

  @ApiProperty({ example: true })
  foodOnlyExcludesDrinks!: boolean;
}
