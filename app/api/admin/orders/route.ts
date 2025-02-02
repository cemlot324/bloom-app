import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type OrderFromDB = {
    _id: ObjectId;
    orderNumber: string;
    userId: ObjectId;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    shippingDetails: {
        address1: string;
        address2?: string;
        city: string;
        postcode: string;
    };
    totalAmount: number;
    status: string;
    createdAt: Date;
};

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        
        // Fetch orders with user details
        const orders: OrderFromDB[] = await db.collection('orders').aggregate([
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