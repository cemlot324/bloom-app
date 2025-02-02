import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action } = body;
        const { db } = await connectToDatabase();

        if (action === 'login') {
            const { email, password } = body;
            const user = await db.collection('users').findOne({ email });
            
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const isValid = await bcrypt.compare(password, user.password);
            
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
            }

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            return NextResponse.json({
                user: {
                    id: user._id,
                    ...userWithoutPassword
                }
            });
        }

        if (action === 'register') {
            const { 
                email, 
                password,
                firstName,
                lastName,
                address1,
                address2,
                city,
                postcode,
                phone
            } = body;

            // Check if user exists
            const existingUser = await db.collection('users').findOne({ email });
            
            if (existingUser) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user object
            const userToInsert = {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                address1,
                address2,
                city,
                postcode,
                phone,
                createdAt: new Date()
            };

            // Insert user
            const result = await db.collection('users').insertOne(userToInsert);

            // Remove password from response
            const { password: _, ...userWithoutPassword } = userToInsert;

            return NextResponse.json({
                user: {
                    id: result.insertedId,
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