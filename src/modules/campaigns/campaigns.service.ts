import { Injectable } from '@nestjs/common';
import { CampaignType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULT_TEMPLATES: Record<CampaignType, { title: string; body: string }> = {
  BIRTHDAY: {
    title: 'Happy Birthday',
    body: 'Happy Birthday from {{restaurantName}}. Enjoy a complimentary dessert this week.',
  },
  INACTIVE: {
    title: 'We miss you',
    body: "Hi, we've missed you. It's been a while since your last visit. Your member rewards are still waiting.",
  },
  QUIET_DAY: {
    title: 'Members only today',
    body: 'Members only. Exclusive offer available today. Book your table or order takeaway now.',
  },
  SEASONAL: {
    title: 'Seasonal offer',
    body: 'A special seasonal offer is waiting for you — Ramadan, Eid, Valentine\'s, Christmas & more.',
  },
  SYSTEM_UNLOCK: {
    title: 'Reward unlocked',
    body: 'A new reward has been unlocked in your wallet.',
  },
};

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureDefaults(restaurantId: string) {
    for (const type of Object.values(CampaignType)) {
      const tpl = DEFAULT_TEMPLATES[type];
      await this.prisma.campaignTemplate.upsert({
        where: { restaurantId_type: { restaurantId, type } },
        create: {
          restaurantId,
          type,
          title: tpl.title,
          bodyTemplate: tpl.body,
        },
        update: {},
      });
    }
  }

  list(restaurantId: string) {
    return this.prisma.campaignTemplate.findMany({ where: { restaurantId } });
  }

  async runBirthdayCampaign(restaurantId: string) {
    const today = new Date();
    const members = await this.prisma.member.findMany({
      where: {
        restaurantId,
        birthday: { not: null },
      },
    });

    const sent = members.filter((m) => {
      if (!m.birthday) return false;
      return (
        m.birthday.getUTCMonth() === today.getUTCMonth() &&
        m.birthday.getUTCDate() === today.getUTCDate()
      );
    });

    const tpl = await this.prisma.campaignTemplate.findUnique({
      where: { restaurantId_type: { restaurantId, type: CampaignType.BIRTHDAY } },
    });

    for (const m of sent) {
      await this.prisma.memberNotification.create({
        data: {
          memberId: m.id,
          title: tpl?.title ?? 'Happy Birthday',
          body: (tpl?.bodyTemplate ?? '').replace('{{restaurantName}}', 'your restaurant'),
        },
      });
    }

    return { sent: sent.length };
  }
}
