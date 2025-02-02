import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const { db } = await connectToDatabase();
        const products = await db.collection('products')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
} 