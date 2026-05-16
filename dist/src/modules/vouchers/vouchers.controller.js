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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VouchersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const auth_util_1 = require("../../common/auth.util");
const loyalty_service_1 = require("../loyalty/loyalty.service");
const prisma_service_1 = require("../../prisma/prisma.service");
class RedeemDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemDto.prototype, "qrToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RedeemDto.prototype, "billAmount", void 0);
let VouchersController = class VouchersController {
    constructor(loyalty, prisma) {
        this.loyalty = loyalty;
        this.prisma = prisma;
    }
    async wallet(authHeader) {
        const memberId = this.memberId(authHeader);
        return this.prisma.voucher.findMany({
            where: { memberId, status: 'ACTIVE' },
            orderBy: { validUntil: 'asc' },
        });
    }
    redeem(authHeader, body) {
        const staffId = this.staffIdOptional(authHeader);
        return this.loyalty.redeemByQrToken(body.qrToken, staffId, body.billAmount);
    }
    lookup(qrToken) {
        return this.prisma.voucher.findUnique({
            where: { qrToken },
            include: { member: { select: { name: true, email: true, loyaltyStage: true } } },
        });
    }
    memberId(authHeader) {
        const payload = this.parseToken(authHeader);
        if (payload.type !== 'member')
            throw new common_1.UnauthorizedException();
        return payload.sub;
    }
    staffIdOptional(authHeader) {
        if (!authHeader)
            return undefined;
        const payload = this.parseToken(authHeader);
        if (payload.type === 'staff')
            return payload.sub;
        return undefined;
    }
    parseToken(authHeader) {
        if (!authHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing bearer token');
        }
        return (0, auth_util_1.verifyToken)(authHeader.slice(7));
    }
};
exports.VouchersController = VouchersController;
__decorate([
    (0, common_1.Get)('wallet'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Active vouchers in member wallet' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "wallet", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Staff scans QR — redeem voucher and advance loyalty journey' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RedeemDto]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "redeem", null);
__decorate([
    (0, common_1.Get)('lookup/:qrToken'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview voucher before scan (staff)' }),
    __param(0, (0, common_1.Param)('qrToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "lookup", null);
exports.VouchersController = VouchersController = __decorate([
    (0, swagger_1.ApiTags)('Vouchers'),
    (0, common_1.Controller)('vouchers'),
    __metadata("design:paramtypes", [loyalty_service_1.LoyaltyService,
        prisma_service_1.PrismaService])
], VouchersController);
//# sourceMappingURL=vouchers.controller.js.map