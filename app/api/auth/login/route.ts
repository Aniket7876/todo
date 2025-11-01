import { NextRequest, NextResponse } from 'next/server';
import { findUserByIdentifier, mapUserDocumentToUser } from '@/lib/users';
import { setAuthCookie, signAuthToken, verifyPassword } from '@/lib/auth';

interface LoginPayload {
  identifier: string;
  password: string;
}

function validatePayload(payload: unknown): LoginPayload {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid request body');
  }

  const { identifier, password } = payload as Partial<LoginPayload>;

  if (!identifier || typeof identifier !== 'string') {
    throw new Error('Email or username is required');
  }

  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }

  return {
    identifier: identifier.trim(),
    password,
  };
}

export async function POST(request: NextRequest) {
  let payload: LoginPayload;

  try {
    const rawBody = await request.json();
    payload = validatePayload(rawBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const userDocument = await findUserByIdentifier(payload.identifier);
    if (!userDocument) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordValid = await verifyPassword(payload.password, userDocument.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = mapUserDocumentToUser(userDocument);
    const token = signAuthToken(user);
    const response = NextResponse.json({ user });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Failed to sign in user', error);
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
  }
}
