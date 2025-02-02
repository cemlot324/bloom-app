import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = cookies();
        const userCookie = await cookieStore.get('user');
        
        if (!userCookie?.value) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userData = JSON.parse(userCookie.value);
        const { db } = await connectToDatabase();

        const userId = userData._id || userData.id;
        
        const orders = await db.collection('orders')
            .find({ 
                userId: new ObjectId(userId)
            })
            .sort({ createdAt: -1 })
            .toArray();

        // Transform ObjectId to string and ensure all required fields are present
        const formattedOrders = orders.map(order => ({
            _id: order._id.toString(),
            orderNumber: order.orderNumber,
            items: Array.isArray(order.items) ? order.items : [],
            totalAmount: order.totalAmount || 0,
            status: order.status || 'pending',
            createdAt: order.createdAt || new Date().toISOString(),
            userId: order.userId.toString()
        }));

        return NextResponse.json({ orders: formattedOrders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
} 