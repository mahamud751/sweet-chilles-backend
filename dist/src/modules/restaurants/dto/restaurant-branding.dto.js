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
exports.RestaurantBrandingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RestaurantBrandingDto {
}
exports.RestaurantBrandingDto = RestaurantBrandingDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RestaurantBrandingDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sweet-chillies' }),
    __metadata("design:type", String)
], RestaurantBrandingDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sweet Chillies' }),
    __metadata("design:type", String)
], RestaurantBrandingDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sweet Chillies Members Club' }),
    __metadata("design:type", String)
], RestaurantBrandingDto.prototype, "appDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], RestaurantBrandingDto.prototype, "tagline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#F15A24' }),
    __metadata("design:type", String)
], RestaurantBrandingDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], RestaurantBrandingDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    __metadata("design:type", Number)
], RestaurantBrandingDto.prototype, "welcomeDiscountPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], RestaurantBrandingDto.prototype, "foodOnlyExcludesDrinks", void 0);
//# sourceMappingURL=restaurant-branding.dto.js.map