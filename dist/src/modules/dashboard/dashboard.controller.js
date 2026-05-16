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
const auth_util_1 = require("../../common/auth.util");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboard) {
        this.dashboard = dashboard;
    }
    stats(authHeader) {
        const restaurantId = this.restaurantId(authHeader);
        return this.dashboard.stats(restaurantId);
    }
    members(authHeader) {
        const restaurantId = this.restaurantId(authHeader);
        return this.dashboard.members(restaurantId);
    }
    restaurantId(authHeader) {
        if (!authHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException();
        }
        const payload = (0, auth_util_1.verifyToken)(authHeader.slice(7));
        if (payload.type !== 'staff' || !payload.restaurantId) {
            throw new common_1.UnauthorizedException('Staff access required');
        }
        return payload.restaurantId;
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Owner dashboard — members, revenue, redemptions' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('members'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Member list for restaurant CRM' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "members", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map