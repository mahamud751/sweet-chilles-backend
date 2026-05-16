"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffPayloadFromHeader = staffPayloadFromHeader;
exports.canManageRestaurant = canManageRestaurant;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_util_1 = require("./auth.util");
function staffPayloadFromHeader(authHeader) {
    if (!authHeader?.startsWith('Bearer ')) {
        throw new common_1.UnauthorizedException('Missing bearer token');
    }
    const payload = (0, auth_util_1.verifyToken)(authHeader.slice(7));
    if (payload.type !== 'staff') {
        throw new common_1.UnauthorizedException('Staff access only');
    }
    return payload;
}
function canManageRestaurant(role, userRestaurantId, restaurantId) {
    if (role === client_1.UserRole.SAVASAACHI_ADMIN)
        return true;
    return userRestaurantId === restaurantId;
}
//# sourceMappingURL=staff-auth.util.js.map