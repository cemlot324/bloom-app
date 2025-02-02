import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        if (!db) throw new Error('Failed to connect to database');

        const products = await db.collection('products')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        if (!products) {
            return NextResponse.json({ products: [] });
        }

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products', details: error }, 
            { status: 500 }
        );
    }
} 