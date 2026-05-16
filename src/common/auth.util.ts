import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export type JwtPayload = {
  sub: string;
  role: string;
  restaurantId?: string;
  type: 'member' | 'staff';
};

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET ?? 'dev-secret';
  return jwt.sign(payload, secret, { expiresIn: '30d' });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET ?? 'dev-secret';
  return jwt.verify(token, secret) as JwtPayload;
}
