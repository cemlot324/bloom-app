import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Order = {
    _id: ObjectId;
    totalAmount: number;
    orderNumber: string;
    createdAt: Date;
    status: string;
    user?: {
        firstName: string;
        lastName: string;
    };
};

type TopProduct = {
    _id: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
};

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const orders: Order[] = await db.collection('orders').find().toArray();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: Order) => 
            sum + (order.totalAmount || 0), 0
        );

        const totalProducts = await db.collection('products').countDocuments();
        const totalCustomers = await db.collection('users').countDocuments();

        const recentOrders = await db.collection('orders')
            .aggregate([
                { $sort: { createdAt: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' }
            ]).toArray();

        const topProducts = await db.collection('orders').aggregate<TopProduct>([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.id',
                    name: { $first: '$items.name' },
                    totalSales: { $sum: '$items.quantity' },
                    totalRevenue: { 
                        $sum: { $multiply: ['$items.price', '$items.quantity'] }
                    }
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 5 }
        ]).toArray();

        return NextResponse.json({
            totalOrders,
            totalRevenue,
            totalProducts,
            totalCustomers,
            recentOrders: recentOrders.map((order: Order) => ({
                orderNumber: order.orderNumber,
                date: order.createdAt,
                status: order.status,
                amount: order.totalAmount,
                customerName: order.user 
                    ? `${order.user.firstName} ${order.user.lastName}` 
                    : 'Unknown'
            })),
            topProducts: topProducts.map((product: TopProduct) => ({
                name: product.name,
                sales: product.totalSales,
                revenue: product.totalRevenue
            }))
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
} 