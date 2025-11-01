import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  clearAuthCookie(response);
  return response;
}
