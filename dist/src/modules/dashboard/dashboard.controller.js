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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const staff_auth_util_1 = require("../../common/staff-auth.util");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboard) {
        this.dashboard = dashboard;
    }
    summary(authHeader, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.summary(sub, slug);
    }
    members(authHeader, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.listMembers(sub, slug);
    }
    vouchers(authHeader, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.listVouchers(sub, slug);
    }
    campaigns(authHeader, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.listCampaigns(sub, slug);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Counts for owner/admin dashboard' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('members'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'All loyalty members for this restaurant' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "members", null);
__decorate([
    (0, common_1.Get)('vouchers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'All vouchers/rewards for this restaurant' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "vouchers", null);
__decorate([
    (0, common_1.Get)('campaigns'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Campaign templates / offers' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "campaigns", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map