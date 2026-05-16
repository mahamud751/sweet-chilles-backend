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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_util_1 = require("../../common/auth.util");
const login_dto_1 = require("./dto/login.dto");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(auth) {
        this.auth = auth;
    }
    register(slug, body) {
        return this.auth.registerMember(slug, body);
    }
    login(slug, body) {
        return this.auth.loginMember(slug, body.email, body.password);
    }
    staffLogin(body) {
        return this.auth.loginStaff(body.email, body.password);
    }
    me(authHeader) {
        const memberId = this.memberIdFromHeader(authHeader);
        return this.auth.memberProfile(memberId);
    }
    memberIdFromHeader(authHeader) {
        if (!authHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing bearer token');
        }
        const payload = (0, auth_util_1.verifyToken)(authHeader.slice(7));
        if (payload.type !== 'member')
            throw new common_1.UnauthorizedException('Members only');
        return payload.sub;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('restaurants/:slug/members/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register loyalty member and issue welcome voucher' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, login_dto_1.MemberRegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('restaurants/:slug/members/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Member login' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, login_dto_1.MemberLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('staff/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Restaurant owner/staff login for dashboard & QR scan' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.StaffLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "staffLogin", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Current member profile' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map