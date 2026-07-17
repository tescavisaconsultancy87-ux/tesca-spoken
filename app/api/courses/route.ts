import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { COURSES } from '@/lib/data/content';
import { checkRateLimit } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Basic rate limit check (Max 60 requests/min)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 60, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const dbCourses = await db.getCourses();
    if (dbCourses && dbCourses.length > 0) {
      return NextResponse.json(dbCourses);
    }

    // Fallback to static list if database table is empty/unseeded
    const fallbackCourses = COURSES.map((c) => ({
      id: c.title.toLowerCase().replace(/\s+/g, '-'),
      title: c.title,
    }));

    return NextResponse.json(fallbackCourses);
  } catch (error: any) {
    console.error('[Courses API] Failed to fetch courses:', error);
    
    // Safety fallback
    const fallbackCourses = COURSES.map((c) => ({
      id: c.title.toLowerCase().replace(/\s+/g, '-'),
      title: c.title,
    }));
    return NextResponse.json(fallbackCourses);
  }
}
