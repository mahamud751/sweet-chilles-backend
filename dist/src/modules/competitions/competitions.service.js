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
exports.CompetitionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const loyalty_service_1 = require("../loyalty/loyalty.service");
let CompetitionsService = class CompetitionsService {
    constructor(prisma, loyalty) {
        this.prisma = prisma;
        this.loyalty = loyalty;
    }
    listForRestaurant(restaurantId) {
        return this.prisma.competition.findMany({
            where: { restaurantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    getActive(restaurantSlug) {
        return this.prisma.competition.findFirst({
            where: {
                status: client_1.CompetitionStatus.ACTIVE,
                restaurant: { slug: restaurantSlug },
            },
        });
    }
    async announceWinner(competitionId, winnerMemberId) {
        const competition = await this.prisma.competition.findUnique({
            where: { id: competitionId },
            include: { entries: true },
        });
        if (!competition)
            throw new common_1.NotFoundException('Competition not found');
        await this.prisma.competition.update({
            where: { id: competitionId },
            data: { status: client_1.CompetitionStatus.WINNER_ANNOUNCED, winnerMemberId },
        });
        const losers = competition.entries.filter((e) => e.memberId !== winnerMemberId);
        return {
            competitionId,
            winnerMemberId,
            participantsToMessage: losers.length,
            messengerTemplate: `Thank you for taking part. Although you didn't win this time, the management would still love to welcome you. As a thank you, we are giving every participant an exclusive voucher — valid for the next 30 days. Download our members app to claim.`,
        };
    }
    async grantParticipantVoucher(competitionEntryId, memberId) {
        const entry = await this.prisma.competitionEntry.update({
            where: { id: competitionEntryId },
            data: { memberId, voucherGranted: true, messengerSent: true },
            include: { competition: true },
        });
        await this.loyalty.issueWelcomeVoucher(memberId, entry.competition.restaurantId);
        return entry;
    }
};
exports.CompetitionsService = CompetitionsService;
exports.CompetitionsService = CompetitionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        loyalty_service_1.LoyaltyService])
], CompetitionsService);
//# sourceMappingURL=competitions.service.js.map