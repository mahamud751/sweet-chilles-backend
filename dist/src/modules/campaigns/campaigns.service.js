"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const DEFAULT_TEMPLATES = {
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
let CampaignsService = class CampaignsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureDefaults(restaurantId) {
        for (const type of Object.values(client_1.CampaignType)) {
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
    list(restaurantId) {
        return this.prisma.campaignTemplate.findMany({ where: { restaurantId } });
    }
    async runBirthdayCampaign(restaurantId) {
        const today = new Date();
        const members = await this.prisma.member.findMany({
            where: {
                restaurantId,
                birthday: { not: null },
            },
        });
        const sent = members.filter((m) => {
            if (!m.birthday)
                return false;
            return (m.birthday.getUTCMonth() === today.getUTCMonth() &&
                m.birthday.getUTCDate() === today.getUTCDate());
        });
        const tpl = await this.prisma.campaignTemplate.findUnique({
            where: { restaurantId_type: { restaurantId, type: client_1.CampaignType.BIRTHDAY } },
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
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map