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
exports.CreateDashboardCampaignDto = exports.CreateDashboardVoucherDto = exports.CreateDashboardMemberDto = exports.UpdateDashboardCampaignDto = exports.UpdateDashboardVoucherDto = exports.UpdateDashboardMemberDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class UpdateDashboardMemberDto {
}
exports.UpdateDashboardMemberDto = UpdateDashboardMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDashboardMemberDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateDashboardMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDashboardMemberDto.prototype, "phone", void 0);
class UpdateDashboardVoucherDto {
}
exports.UpdateDashboardVoucherDto = UpdateDashboardVoucherDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateDashboardVoucherDto.prototype, "percentOff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.VoucherStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VoucherStatus),
    __metadata("design:type", String)
], UpdateDashboardVoucherDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '2026-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDashboardVoucherDto.prototype, "validUntil", void 0);
class UpdateDashboardCampaignDto {
}
exports.UpdateDashboardCampaignDto = UpdateDashboardCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDashboardCampaignDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDashboardCampaignDto.prototype, "bodyTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDashboardCampaignDto.prototype, "isEnabled", void 0);
class CreateDashboardMemberDto {
}
exports.CreateDashboardMemberDto = CreateDashboardMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardMemberDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDashboardMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardMemberDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Welcome123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateDashboardMemberDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDashboardMemberDto.prototype, "issueWelcomeVoucher", void 0);
class CreateDashboardVoucherDto {
}
exports.CreateDashboardVoucherDto = CreateDashboardVoucherDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Member email at this restaurant' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDashboardVoucherDto.prototype, "memberEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.VoucherType }),
    (0, class_validator_1.IsEnum)(client_1.VoucherType),
    __metadata("design:type", String)
], CreateDashboardVoucherDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateDashboardVoucherDto.prototype, "percentOff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '2026-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardVoucherDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.VoucherStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VoucherStatus),
    __metadata("design:type", String)
], CreateDashboardVoucherDto.prototype, "status", void 0);
class CreateDashboardCampaignDto {
}
exports.CreateDashboardCampaignDto = CreateDashboardCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.CampaignType }),
    (0, class_validator_1.IsEnum)(client_1.CampaignType),
    __metadata("design:type", String)
], CreateDashboardCampaignDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardCampaignDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardCampaignDto.prototype, "bodyTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDashboardCampaignDto.prototype, "isEnabled", void 0);
//# sourceMappingURL=dashboard.dto.js.map