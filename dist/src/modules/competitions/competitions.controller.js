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
exports.CompetitionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const restaurants_service_1 = require("../restaurants/restaurants.service");
const competitions_service_1 = require("./competitions.service");
class AnnounceWinnerDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnnounceWinnerDto.prototype, "winnerMemberId", void 0);
let CompetitionsController = class CompetitionsController {
    constructor(competitions, restaurants) {
        this.competitions = competitions;
        this.restaurants = restaurants;
    }
    async active(slug) {
        return this.competitions.getActive(slug);
    }
    async list(slug) {
        const r = await this.restaurants.findBySlug(slug);
        if (!r)
            return [];
        return this.competitions.listForRestaurant(r.id);
    }
    announce(id, body) {
        return this.competitions.announceWinner(id, body.winnerMemberId);
    }
};
exports.CompetitionsController = CompetitionsController;
__decorate([
    (0, common_1.Get)('restaurants/:slug/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Active competition for restaurant' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "active", null);
__decorate([
    (0, common_1.Get)('restaurants/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'All competitions for restaurant' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/announce-winner'),
    (0, swagger_1.ApiOperation)({ summary: 'Phase 1 Step 2 — announce winner, prepare loser messaging' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AnnounceWinnerDto]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "announce", null);
exports.CompetitionsController = CompetitionsController = __decorate([
    (0, swagger_1.ApiTags)('Competitions'),
    (0, common_1.Controller)('competitions'),
    __metadata("design:paramtypes", [competitions_service_1.CompetitionsService,
        restaurants_service_1.RestaurantsService])
], CompetitionsController);
//# sourceMappingURL=competitions.controller.js.map