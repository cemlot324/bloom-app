import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Product = {
    _id: ObjectId;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    sku: string;
    createdAt: Date;
};

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { db } = await connectToDatabase();
        
        const product = await db.collection('products').findOne({
            _id: new ObjectId(params.id)
        }) as Product | null;

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            product: {
                ...product,
                _id: product._id.toString()
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
} 