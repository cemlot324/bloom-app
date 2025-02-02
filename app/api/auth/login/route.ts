import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const { db } = await connectToDatabase();

        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Remove sensitive data
        const { password: _, ...userWithoutPassword } = user;

        // Set the cookie with the user data
        cookies().set({
            name: 'user',
            value: JSON.stringify({
                id: user._id.toString(),
                ...userWithoutPassword
            }),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address1: user.address1,
                address2: user.address2,
                city: user.city,
                postcode: user.postcode,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
    }
} 