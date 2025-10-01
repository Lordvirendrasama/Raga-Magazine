
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  const secret = request.nextUrl.searchParams.get('secret');

  // A simple secret to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATE_SECRET) {
    // In a real app, you'd want a more secure secret check
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  }

  if (!path) {
    return NextResponse.json(
      { message: 'Missing path parameter' },
      { status: 400 }
    );
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { message: `Error revalidating: ${error}` },
      { status: 500 }
    );
  }
}
