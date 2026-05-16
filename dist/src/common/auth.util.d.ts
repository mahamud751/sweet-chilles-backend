export type JwtPayload = {
    sub: string;
    role: string;
    restaurantId?: string;
    type: 'member' | 'staff';
};
export declare function hashPassword(plain: string): Promise<string>;
export declare function comparePassword(plain: string, hash: string): Promise<boolean>;
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
