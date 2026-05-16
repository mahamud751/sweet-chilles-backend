import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { CompetitionsService } from './competitions.service';

class AnnounceWinnerDto {
  @IsString()
  winnerMemberId!: string;
}

@ApiTags('Competitions')
@Controller('competitions')
export class CompetitionsController {
  constructor(
    private readonly competitions: CompetitionsService,
    private readonly restaurants: RestaurantsService,
  ) {}

  @Get('restaurants/:slug/active')
  @ApiOperation({ summary: 'Active competition for restaurant' })
  async active(@Param('slug') slug: string) {
    return this.competitions.getActive(slug);
  }

  @Get('restaurants/:slug')
  @ApiOperation({ summary: 'All competitions for restaurant' })
  async list(@Param('slug') slug: string) {
    const r = await this.restaurants.findBySlug(slug);
    if (!r) return [];
    return this.competitions.listForRestaurant(r.id);
  }

  @Post(':id/announce-winner')
  @ApiOperation({ summary: 'Phase 1 Step 2 — announce winner, prepare loser messaging' })
  announce(@Param('id') id: string, @Body() body: AnnounceWinnerDto) {
    return this.competitions.announceWinner(id, body.winnerMemberId);
  }
}
