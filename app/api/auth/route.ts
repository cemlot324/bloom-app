import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

type RegisterData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
    phone: string;
};

type LoginData = {
    email: string;
    password: string;
};

type AuthAction = {
    action: 'login' | 'register';
} & (
    | { action: 'login'; } & LoginData
    | { action: 'register'; } & RegisterData
);

export async function POST(req: Request) {
    try {
        const body = await req.json() as AuthAction;
        const { db } = await connectToDatabase();

        if (body.action === 'login') {
            const user = await db.collection('users').findOne({ email: body.email });
            
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const isValid = await bcrypt.compare(body.password, user.password);
            
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
            }

            const { password: _, ...userWithoutPassword } = user;

            return NextResponse.json({
                user: {
                    id: user._id.toString(),
                    ...userWithoutPassword
                }
            });
        }

        if (body.action === 'register') {
            const existingUser = await db.collection('users').findOne({ email: body.email });
            
            if (existingUser) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(body.password, 10);

            const userToInsert = {
                ...body,
                password: hashedPassword,
                createdAt: new Date()
            };

            const result = await db.collection('users').insertOne(userToInsert);
            const { password: _, ...userWithoutPassword } = userToInsert;

            return NextResponse.json({
                user: {
                    id: result.insertedId.toString(),
                    ...userWithoutPassword
                }
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
} 