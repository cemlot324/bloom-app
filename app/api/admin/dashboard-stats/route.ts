import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        // Get total orders and revenue
        const orders = await db.collection('orders').find().toArray();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Get total products
        const totalProducts = await db.collection('products').countDocuments();

        // Get total customers (unique users who have placed orders)
        const totalCustomers = await db.collection('users').countDocuments();

        // Get recent orders with user details
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

        // Get top selling products
        const topProducts = await db.collection('orders').aggregate([
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
            recentOrders: recentOrders.map(order => ({
                orderNumber: order.orderNumber,
                date: order.createdAt,
                status: order.status,
                amount: order.totalAmount,
                customerName: `${order.user.firstName} ${order.user.lastName}`
            })),
            topProducts: topProducts.map(product => ({
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