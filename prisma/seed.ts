import {
  CompetitionStatus,
  LoyaltyStage,
  UserRole,
  VoucherStatus,
  VoucherType,
} from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function ensureActiveVoucher(
  restaurantId: string,
  memberId: string,
  type: VoucherType,
  percentOff: number,
  validDays: number,
) {
  const existing = await prisma.voucher.findFirst({
    where: { memberId, type, status: VoucherStatus.ACTIVE },
  });
  if (existing) return existing;

  return prisma.voucher.create({
    data: {
      restaurantId,
      memberId,
      type,
      percentOff,
      validUntil: daysFromNow(validDays),
    },
  });
}

async function ensureHistoryVoucher(
  restaurantId: string,
  memberId: string,
  type: VoucherType,
  percentOff: number,
  status: 'REDEEMED' | 'EXPIRED',
  daysOffset: number,
) {
  const existing = await prisma.voucher.findFirst({
    where: { memberId, type, status },
  });
  if (existing) return existing;

  const validUntil =
    status === VoucherStatus.EXPIRED
      ? daysAgo(Math.abs(daysOffset))
      : daysFromNow(30);

  return prisma.voucher.create({
    data: {
      restaurantId,
      memberId,
      type,
      percentOff,
      status,
      validUntil,
      redeemedAt: status === VoucherStatus.REDEEMED ? daysAgo(daysOffset) : null,
    },
  });
}

async function main() {
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'sweet-chillies' },
    create: {
      slug: 'sweet-chillies',
      name: 'Sweet Chillies',
      appDisplayName: 'Sweet Chillies',
      tagline: null,
      primaryColor: '#F15A24',
      welcomeDiscountPercent: 30,
    },
    update: {
      appDisplayName: 'Sweet Chillies',
      tagline: null,
    },
  });

  const ownerHash = await bcrypt.hash('owner123', 10);
  await prisma.user.upsert({
    where: { email: 'owner@sweetchillies.co.uk' },
    create: {
      email: 'owner@sweetchillies.co.uk',
      passwordHash: ownerHash,
      role: UserRole.RESTAURANT_OWNER,
      displayName: 'Sweet Chillies Owner',
      restaurantId: restaurant.id,
    },
    update: { passwordHash: ownerHash },
  });

  const staffHash = await bcrypt.hash('staff123', 10);
  await prisma.user.upsert({
    where: { email: 'staff@sweetchillies.co.uk' },
    create: {
      email: 'staff@sweetchillies.co.uk',
      passwordHash: staffHash,
      role: UserRole.RESTAURANT_STAFF,
      displayName: 'Sweet Chillies Staff',
      restaurantId: restaurant.id,
    },
    update: { passwordHash: staffHash },
  });

  const memberHash = await bcrypt.hash('123456', 10);
  const demoMember = await prisma.member.upsert({
    where: {
      restaurantId_email: {
        restaurantId: restaurant.id,
        email: 'pino@gmail.com',
      },
    },
    create: {
      restaurantId: restaurant.id,
      email: 'pino@gmail.com',
      passwordHash: memberHash,
      name: 'Mahamud Pino',
      phone: '01789999751',
      birthday: new Date('1990-06-15'),
      loyaltyStage: LoyaltyStage.LOYALTY_ACTIVE,
      loyaltyVisitsRemaining: 3,
    },
    update: {
      passwordHash: memberHash,
      name: 'Mahamud Pino',
      loyaltyStage: LoyaltyStage.LOYALTY_ACTIVE,
      loyaltyVisitsRemaining: 3,
    },
  });

  // Active rewards — shown on Home "My Rewards" (up to 3 cards) and My Offers → Active
  await ensureActiveVoucher(restaurant.id, demoMember.id, VoucherType.WELCOME, 30, 30);
  await ensureActiveVoucher(restaurant.id, demoMember.id, VoucherType.RETURN, 20, 45);
  await ensureActiveVoucher(restaurant.id, demoMember.id, VoucherType.LOYALTY, 15, 90);

  // History — My Offers → Used / Expired tabs
  await ensureHistoryVoucher(
    restaurant.id,
    demoMember.id,
    VoucherType.THIRD,
    15,
    VoucherStatus.REDEEMED,
    12,
  );
  await ensureHistoryVoucher(
    restaurant.id,
    demoMember.id,
    VoucherType.WELCOME,
    10,
    VoucherStatus.EXPIRED,
    45,
  );

  await prisma.competition.upsert({
    where: { id: 'seed-competition-sweet-chillies' },
    create: {
      id: 'seed-competition-sweet-chillies',
      restaurantId: restaurant.id,
      title: 'Win Dinner for 2 at Sweet Chillies',
      prizeDescription: 'Win Dinner for 2',
      status: CompetitionStatus.ACTIVE,
      platforms: ['Facebook', 'Instagram', 'TikTok'],
      targetEntries: 500,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    update: { status: CompetitionStatus.ACTIVE },
  });

  const campaignTypes = [
    ['BIRTHDAY', 'Happy Birthday', 'Happy Birthday from Sweet Chillies. Enjoy a complimentary dessert this week.'],
    ['INACTIVE', 'We miss you', "Hi, we've missed you. Your member rewards are still waiting."],
    ['QUIET_DAY', 'Members only', 'Members only. Exclusive offer available today.'],
    ['SEASONAL', 'Seasonal offer', 'Special offers for Ramadan, Eid, Valentine\'s, Christmas & more.'],
  ] as const;

  for (const [type, title, body] of campaignTypes) {
    await prisma.campaignTemplate.upsert({
      where: {
        restaurantId_type: { restaurantId: restaurant.id, type },
      },
      create: {
        restaurantId: restaurant.id,
        type,
        title,
        bodyTemplate: body,
      },
      update: {},
    });
  }

  const activeCount = await prisma.voucher.count({
    where: { memberId: demoMember.id, status: VoucherStatus.ACTIVE },
  });

  console.log('Seeded restaurant:', restaurant.slug);
  console.log('Owner (Staff tab): owner@sweetchillies.co.uk / owner123');
  console.log('Staff: staff@sweetchillies.co.uk / staff123');
  console.log('Member: pino@gmail.com / 123456');
  console.log(`Demo member active vouchers: ${activeCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
