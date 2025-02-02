import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        
        // Fetch orders with user details
        const orders = await db.collection('orders').aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $sort: { createdAt: -1 }
            }
        ]).toArray();

        const formattedOrders = orders.map(order => ({
            _id: order._id.toString(),
            orderNumber: order.orderNumber,
            userId: order.userId.toString(),
            user: {
                firstName: order.user.firstName,
                lastName: order.user.lastName,
                email: order.user.email
            },
            items: order.items,
            shippingDetails: order.shippingDetails,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt
        }));

        return NextResponse.json({ orders: formattedOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
} 