import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { verifyToken, type JwtPayload } from './auth.util';

export type StaffPayload = JwtPayload & { type: 'staff' };

export function staffPayloadFromHeader(authHeader?: string): StaffPayload {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing bearer token');
  }
  const payload = verifyToken(authHeader.slice(7));
  if (payload.type !== 'staff') {
    throw new UnauthorizedException('Staff access only');
  }
  return payload as StaffPayload;
}

export function canManageRestaurant(
  role: UserRole,
  userRestaurantId: string | null,
  restaurantId: string,
): boolean {
  if (role === UserRole.SAVASAACHI_ADMIN) return true;
  return userRestaurantId === restaurantId;
}
