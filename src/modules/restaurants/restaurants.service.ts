import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly campaigns: CampaignsService,
  ) {}

  findBySlug(slug: string) {
    return this.prisma.restaurant.findFirst({
      where: { slug, isActive: true },
    });
  }

  async getBranding(slug: string) {
    const restaurant = await this.findBySlug(slug);
    if (!restaurant) throw new NotFoundException(`Restaurant "${slug}" not found`);
    return restaurant;
  }

  listActive() {
    return this.prisma.restaurant.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async listCampaigns(slug: string) {
    const restaurant = await this.findBySlug(slug);
    if (!restaurant) throw new NotFoundException(`Restaurant "${slug}" not found`);
    await this.campaigns.ensureDefaults(restaurant.id);
    return this.campaigns.list(restaurant.id);
  }
}
