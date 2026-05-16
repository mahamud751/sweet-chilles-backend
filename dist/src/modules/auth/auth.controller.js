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
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const path_1 = require("path");
const fs_1 = require("fs");
const auth_util_1 = require("../../common/auth.util");
const login_dto_1 = require("./dto/login.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const update_staff_profile_dto_1 = require("./dto/update-staff-profile.dto");
const staff_auth_util_1 = require("../../common/staff-auth.util");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const auth_service_1 = require("./auth.service");
const AVATAR_DIR = (0, path_1.join)(process.cwd(), 'uploads', 'avatars');
function ensureAvatarDir() {
    if (!(0, fs_1.existsSync)(AVATAR_DIR)) {
        (0, fs_1.mkdirSync)(AVATAR_DIR, { recursive: true });
    }
}
let AuthController = class AuthController {
    constructor(auth) {
        this.auth = auth;
    }
    register(slug, body) {
        return this.auth.registerMember(slug, body);
    }
    unifiedLogin(slug, body) {
        return this.auth.loginUnified(slug, body.email, body.password);
    }
    login(slug, body) {
        return this.auth.loginMember(slug, body.email, body.password);
    }
    staffLogin(body) {
        return this.auth.loginStaff(body.email, body.password);
    }
    async me(authHeader) {
        const payload = this.payloadFromHeader(authHeader);
        if (payload.type === 'member') {
            const member = await this.auth.memberProfile(payload.sub);
            return { accountType: 'member', member };
        }
        const staff = await this.auth.staffProfile(payload.sub);
        return { accountType: 'staff', staff };
    }
    updateStaffMe(authHeader, body) {
        const payload = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.auth.updateStaffProfile(payload.sub, body);
    }
    changeStaffPassword(authHeader, body) {
        const payload = (0, staff_auth_util_1.staffPayloadFromHeader)(authHeader);
        return this.auth.changeStaffPassword(payload.sub, body.currentPassword, body.newPassword);
    }
    updateMe(authHeader, body) {
        const memberId = this.memberIdFromHeader(authHeader);
        return this.auth.updateMemberProfile(memberId, body);
    }
    changePassword(authHeader, body) {
        const memberId = this.memberIdFromHeader(authHeader);
        return this.auth.changeMemberPassword(memberId, body.currentPassword, body.newPassword);
    }
    createBooking(authHeader, body) {
        const memberId = this.memberIdFromHeader(authHeader);
        return this.auth.createBooking(memberId, body);
    }
    uploadAvatar(authHeader, file) {
        const memberId = this.memberIdFromHeader(authHeader);
        if (!file)
            throw new common_1.BadRequestException('No image uploaded');
        return this.auth.updateMemberAvatar(memberId, file.filename);
    }
    memberIdFromHeader(authHeader) {
        const payload = this.payloadFromHeader(authHeader);
        if (payload.type !== 'member')
            throw new common_1.UnauthorizedException('Members only');
        return payload.sub;
    }
    payloadFromHeader(authHeader) {
        if (!authHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing bearer token');
        }
        return (0, auth_util_1.verifyToken)(authHeader.slice(7));
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
    (0, common_1.Post)('restaurants/:slug/login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Unified login (member, staff, owner, or platform admin)',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, login_dto_1.MemberLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "unifiedLogin", null);
__decorate([
    (0, common_1.Post)('restaurants/:slug/members/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Member login (legacy)' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Current session (member or staff/admin)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('staff/me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update staff/owner/admin profile' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_staff_profile_dto_1.UpdateStaffProfileDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateStaffMe", null);
__decorate([
    (0, common_1.Patch)('staff/me/password'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change staff/owner/admin password' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_staff_profile_dto_1.ChangeStaffPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changeStaffPassword", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update member profile (name, email, phone, birthday)' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateMemberProfileDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Patch)('me/password'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change member password' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.ChangeMemberPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('me/bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Book a table' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Post)('me/avatar'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { avatar: { type: 'string', format: 'binary' } },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload profile photo' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                ensureAvatarDir();
                cb(null, AVATAR_DIR);
            },
            filename: (_req, file, cb) => {
                const ext = (0, path_1.extname)(file.originalname).toLowerCase() || '.jpg';
                const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
                    ? ext
                    : '.jpg';
                cb(null, `${(0, crypto_1.randomUUID)()}${safeExt}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            if (!file.mimetype.match(/^image\/(jpeg|png|webp|jpg)$/)) {
                cb(new common_1.BadRequestException('Only JPEG, PNG, or WebP images allowed'), false);
                return;
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "uploadAvatar", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map