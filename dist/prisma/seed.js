"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_2.PrismaClient();
function daysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}
function daysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
}
async function ensureActiveVoucher(restaurantId, memberId, type, percentOff, validDays) {
    const existing = await prisma.voucher.findFirst({
        where: { memberId, type, status: client_1.VoucherStatus.ACTIVE },
    });
    if (existing)
        return existing;
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
async function ensureHistoryVoucher(restaurantId, memberId, type, percentOff, status, daysOffset) {
    const existing = await prisma.voucher.findFirst({
        where: { memberId, type, status },
    });
    if (existing)
        return existing;
    const validUntil = status === client_1.VoucherStatus.EXPIRED
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
            redeemedAt: status === client_1.VoucherStatus.REDEEMED ? daysAgo(daysOffset) : null,
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
            role: client_1.UserRole.RESTAURANT_OWNER,
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
            role: client_1.UserRole.RESTAURANT_STAFF,
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
            loyaltyStage: client_1.LoyaltyStage.LOYALTY_ACTIVE,
            loyaltyVisitsRemaining: 3,
        },
        update: {
            passwordHash: memberHash,
            name: 'Mahamud Pino',
            loyaltyStage: client_1.LoyaltyStage.LOYALTY_ACTIVE,
            loyaltyVisitsRemaining: 3,
        },
    });
    await ensureActiveVoucher(restaurant.id, demoMember.id, client_1.VoucherType.WELCOME, 30, 30);
    await ensureActiveVoucher(restaurant.id, demoMember.id, client_1.VoucherType.RETURN, 20, 45);
    await ensureActiveVoucher(restaurant.id, demoMember.id, client_1.VoucherType.LOYALTY, 15, 90);
    await ensureHistoryVoucher(restaurant.id, demoMember.id, client_1.VoucherType.THIRD, 15, client_1.VoucherStatus.REDEEMED, 12);
    await ensureHistoryVoucher(restaurant.id, demoMember.id, client_1.VoucherType.WELCOME, 10, client_1.VoucherStatus.EXPIRED, 45);
    await prisma.competition.upsert({
        where: { id: 'seed-competition-sweet-chillies' },
        create: {
            id: 'seed-competition-sweet-chillies',
            restaurantId: restaurant.id,
            title: 'Win Dinner for 2 at Sweet Chillies',
            prizeDescription: 'Win Dinner for 2',
            status: client_1.CompetitionStatus.ACTIVE,
            platforms: ['Facebook', 'Instagram', 'TikTok'],
            targetEntries: 500,
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        update: { status: client_1.CompetitionStatus.ACTIVE },
    });
    const campaignTypes = [
        ['BIRTHDAY', 'Happy Birthday', 'Happy Birthday from Sweet Chillies. Enjoy a complimentary dessert this week.'],
        ['INACTIVE', 'We miss you', "Hi, we've missed you. Your member rewards are still waiting."],
        ['QUIET_DAY', 'Members only', 'Members only. Exclusive offer available today.'],
        ['SEASONAL', 'Seasonal offer', 'Special offers for Ramadan, Eid, Valentine\'s, Christmas & more.'],
    ];
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
        where: { memberId: demoMember.id, status: client_1.VoucherStatus.ACTIVE },
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
//# sourceMappingURL=seed.js.map