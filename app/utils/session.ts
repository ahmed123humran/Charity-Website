import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

const JWT_EXPIRATION = '7d'; // 7 days

export interface SessionPayload extends JWTPayload {
    userId: number;
    role: string;
}

/**
 * Create a signed JWT session token
 * @param userId - The user's database ID
 * @param role - The user's role (ADMIN, EDITOR, VIEWER)
 * @returns Signed JWT token string
 */
export async function createSession(userId: number, role: string): Promise<string> {
    return new SignJWT({ userId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRATION)
        .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT session token
 * @param token - The JWT token string from the cookie
 * @returns The decoded payload with userId and role, or null if invalid
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as SessionPayload;
    } catch {
        return null;
    }
}
