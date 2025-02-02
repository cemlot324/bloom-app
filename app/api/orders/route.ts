import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        const userCookie = await cookieStore.get('user');
        
        if (!userCookie?.value) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userData = JSON.parse(userCookie.value);
        const { items, shippingDetails, totalAmount, paymentMethod } = await req.json();
        const { db } = await connectToDatabase();

        // Generate order number (current timestamp + random string)
        const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

        const order = {
            userId: new ObjectId(userData.id),
            orderNumber,
            items,
            shippingDetails,
            totalAmount,
            paymentMethod,
            status: 'pending',
            createdAt: new Date()
        };

        const result = await db.collection('orders').insertOne(order);

        return NextResponse.json({ 
            success: true, 
            orderNumber,
            orderId: result.insertedId 
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
} 