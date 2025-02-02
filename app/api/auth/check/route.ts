import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = cookies();
        const userCookie = await cookieStore.get('user');
        
        if (!userCookie?.value) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userData = JSON.parse(userCookie.value);
        return NextResponse.json({ user: userData });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
} 