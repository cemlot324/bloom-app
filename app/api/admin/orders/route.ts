import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type OrderUser = {
    firstName: string;
    lastName: string;
    email: string;
};

type OrderItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

type OrderFromDB = {
    _id: ObjectId;
    orderNumber: string;
    userId: ObjectId;
    user: OrderUser;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: Date;
};

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        
        const orders: OrderFromDB[] = await db.collection('orders').aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $sort: { createdAt: -1 } }
        ]).toArray();

        const formattedOrders = orders.map((order: OrderFromDB) => ({
            _id: order._id.toString(),
            orderNumber: order.orderNumber,
            userId: order.userId.toString(),
            user: {
                firstName: order.user.firstName,
                lastName: order.user.lastName,
                email: order.user.email
            },
            items: order.items,
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