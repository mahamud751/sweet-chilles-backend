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
const dashboard_dto_1 = require("./dto/dashboard.dto");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboard) {
        this.dashboard = dashboard;
    }
    summary(authHeader, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.summary(sub, slug);
    }
    members(authHeader, slug, q) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        if (q?.trim()) {
            return this.dashboard.searchMembers(sub, q.trim(), slug);
        }
        return this.dashboard.listMembers(sub, slug);
    }
    createMember(authHeader, body, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.createMember(sub, body, slug);
    }
    updateMember(authHeader, id, body, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.updateMember(sub, id, body, slug);
    }
    deleteMember(authHeader, id, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.deleteMember(sub, id, slug);
    }
    vouchers(authHeader, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.listVouchers(sub, slug);
    }
    createVoucher(authHeader, body, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.createVoucher(sub, body, slug);
    }
    updateVoucher(authHeader, id, body, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.updateVoucher(sub, id, body, slug);
    }
    deleteVoucher(authHeader, id, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.deleteVoucher(sub, id, slug);
    }
    campaigns(authHeader, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.listCampaigns(sub, slug);
    }
    createCampaign(authHeader, body, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.createCampaign(sub, body, slug);
    }
    updateCampaign(authHeader, id, body, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.updateCampaign(sub, id, body, slug);
    }
    deleteCampaign(authHeader, id, slug) {
        const { sub } = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.dashboard.deleteCampaign(sub, id, slug);
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
    __param(2, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "members", null);
__decorate([
    (0, common_1.Post)('members'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a member (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_dto_1.CreateDashboardMemberDto, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "createMember", null);
__decorate([
    (0, common_1.Patch)('members/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a member (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dashboard_dto_1.UpdateDashboardMemberDto, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)('members/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a member (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "deleteMember", null);
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
    (0, common_1.Post)('vouchers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a voucher for a member (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_dto_1.CreateDashboardVoucherDto, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "createVoucher", null);
__decorate([
    (0, common_1.Patch)('vouchers/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a voucher (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dashboard_dto_1.UpdateDashboardVoucherDto, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "updateVoucher", null);
__decorate([
    (0, common_1.Delete)('vouchers/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a voucher (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "deleteVoucher", null);
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
__decorate([
    (0, common_1.Post)('campaigns'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a campaign template (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_dto_1.CreateDashboardCampaignDto, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Patch)('campaigns/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a campaign (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dashboard_dto_1.UpdateDashboardCampaignDto, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "updateCampaign", null);
__decorate([
    (0, common_1.Delete)('campaigns/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a campaign (owner/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "deleteCampaign", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map