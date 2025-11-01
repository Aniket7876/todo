import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { mapUserDocumentToUser, findUserById } from './users';
import type { User } from '@/types/user';

const AUTH_COOKIE_NAME = 'auth_token';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const authCookieName = AUTH_COOKIE_NAME;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable');
  }

  return secret;
}

type AuthClaims = JwtPayload & {
  sub: string;
  username: string;
  email: string;
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(user: { id: string; username: string; email: string }): string {
  const secret = getJwtSecret();
  return jwt.sign({ sub: user.id, username: user.username, email: user.email }, secret, {
    expiresIn: TOKEN_TTL_SECONDS,
  });
}

export function verifyAuthToken(token: string): AuthClaims | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as AuthClaims;
  } catch (error) {
    console.warn('Failed to verify auth token', error);
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOKEN_TTL_SECONDS,
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const claims = verifyAuthToken(token);
  return claims?.sub ?? null;
}

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return null;
  }

  const document = await findUserById(userId);
  return document ? mapUserDocumentToUser(document) : null;
}

export async function getUserFromCookies(): Promise<User | null> {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const claims = verifyAuthToken(token);
  if (!claims?.sub) {
    return null;
  }

  const document = await findUserById(claims.sub);
  return document ? mapUserDocumentToUser(document) : null;
}
