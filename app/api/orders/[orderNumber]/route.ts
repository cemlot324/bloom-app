import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: { orderNumber: string } }
) {
    try {
        const cookieStore = cookies();
        const userCookie = await cookieStore.get('user');
        
        if (!userCookie?.value) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userData = JSON.parse(userCookie.value);
        const { db } = await connectToDatabase();
        
        const order = await db.collection('orders').findOne({
            orderNumber: params.orderNumber,
            userId: new ObjectId(userData.id)
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
} 