import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        // Get sales by month
        const salesByMonth = await db.collection('orders').aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: '$createdAt' } },
                        month: { $month: { $toDate: '$createdAt' } }
                    },
                    sales: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]).toArray();

        // Get top categories
        const topCategories = await db.collection('products').aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    revenue: { $sum: '$price' }
                }
            },
            { $sort: { count: -1 } }
        ]).toArray();

        // Get customer stats
        const totalCustomers = await db.collection('users').countDocuments();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const newCustomers = await db.collection('users').countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        return NextResponse.json({
            salesByMonth: salesByMonth.map(month => ({
                month: `${month._id.year}-${month._id.month}`,
                sales: month.sales,
                revenue: month.revenue
            })),
            topCategories: topCategories.map(cat => ({
                category: cat._id,
                count: cat.count,
                revenue: cat.revenue
            })),
            customerStats: {
                totalCustomers,
                newCustomers,
                returningCustomers: totalCustomers - newCustomers
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
} 