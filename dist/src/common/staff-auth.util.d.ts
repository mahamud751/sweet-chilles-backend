import { UserRole } from '@prisma/client';
import { type JwtPayload } from './auth.util';
export type StaffPayload = JwtPayload & {
    type: 'staff';
};
export declare function staffPayloadFromHeader(authHeader?: string): StaffPayload;
export declare function canManageRestaurant(role: UserRole, userRestaurantId: string | null, restaurantId: string): boolean;
