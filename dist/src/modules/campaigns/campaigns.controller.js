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
exports.CampaignsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_util_1 = require("../../common/auth.util");
const campaigns_service_1 = require("./campaigns.service");
let CampaignsController = class CampaignsController {
    constructor(campaigns) {
        this.campaigns = campaigns;
    }
    list(authHeader) {
        const restaurantId = this.restaurantId(authHeader);
        return this.campaigns.list(restaurantId);
    }
    runBirthday(authHeader) {
        const restaurantId = this.restaurantId(authHeader);
        return this.campaigns.runBirthdayCampaign(restaurantId);
    }
    seed(restaurantId) {
        return this.campaigns.ensureDefaults(restaurantId);
    }
    restaurantId(authHeader) {
        if (!authHeader?.startsWith('Bearer '))
            throw new common_1.UnauthorizedException();
        const payload = (0, auth_util_1.verifyToken)(authHeader.slice(7));
        if (!payload.restaurantId)
            throw new common_1.UnauthorizedException();
        return payload.restaurantId;
    }
};
exports.CampaignsController = CampaignsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'AI engagement templates (birthday, inactive, quiet day, seasonal)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('run/birthday'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger birthday messages for today' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "runBirthday", null);
__decorate([
    (0, common_1.Post)('restaurants/:restaurantId/seed-templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Install default campaign templates for a restaurant' }),
    __param(0, (0, common_1.Param)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "seed", null);
exports.CampaignsController = CampaignsController = __decorate([
    (0, swagger_1.ApiTags)('Campaigns'),
    (0, common_1.Controller)('campaigns'),
    __metadata("design:paramtypes", [campaigns_service_1.CampaignsService])
], CampaignsController);
//# sourceMappingURL=campaigns.controller.js.map