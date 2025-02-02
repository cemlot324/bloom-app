import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    sku: string;
    createdAt: Date;
};

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        if (!db) throw new Error('Failed to connect to database');

        const products = await db.collection('products')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ 
            products: products.map((product: Product) => ({
                ...product,
                _id: product._id.toString()
            }))
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' }, 
            { status: 500 }
        );
    }
} 