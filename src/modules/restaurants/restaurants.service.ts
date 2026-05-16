import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
