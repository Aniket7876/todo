import { NextRequest, NextResponse } from 'next/server';
import { createUser, isEmailTaken, isUsernameTaken, DuplicateEmailError, DuplicateUsernameError } from '@/lib/users';
import { hashPassword, setAuthCookie, signAuthToken } from '@/lib/auth';

interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

function validatePayload(payload: unknown): SignupPayload {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid request body');
  }

  const { username, email, password } = payload as Partial<SignupPayload>;

  if (!username || typeof username !== 'string') {
    throw new Error('Username is required');
  }

  if (!email || typeof email !== 'string') {
    throw new Error('Email is required');
  }

  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 32) {
    throw new Error('Username must be between 3 and 32 characters');
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    throw new Error('Invalid email address');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  return {
    username: trimmedUsername,
    email: trimmedEmail,
    password,
  };
}

export async function POST(request: NextRequest) {
  let payload: SignupPayload;

  try {
    const rawBody = await request.json();
    payload = validatePayload(rawBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const [emailTaken, usernameTaken] = await Promise.all([
      isEmailTaken(payload.email),
      isUsernameTaken(payload.username),
    ]);

    if (emailTaken) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
    }

    if (usernameTaken) {
      return NextResponse.json({ error: 'Username is already in use' }, { status: 409 });
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await createUser({
      username: payload.username,
      email: payload.email,
      passwordHash,
    });

    const token = signAuthToken(user);
    const response = NextResponse.json({ user }, { status: 201 });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    if (error instanceof DuplicateUsernameError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error('Failed to sign up user', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
