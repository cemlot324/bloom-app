import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
    req: Request
) {
    try {
        const { status } = await req.json();
        const orderId = req.url.split('/').pop();
        const { db } = await connectToDatabase();

        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
} 