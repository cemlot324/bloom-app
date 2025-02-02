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

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const products = await db.collection('products').find({}).toArray();
        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { db } = await connectToDatabase();
        const product = await req.json();

        if (!product.sku) {
            const count = await db.collection('products').countDocuments();
            product.sku = `BLM${(count + 1).toString().padStart(5, '0')}`;
        }

        product.createdAt = new Date();
        const result = await db.collection('products').insertOne(product);
        
        return NextResponse.json({
            product: { ...product, _id: result.insertedId }
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { db } = await connectToDatabase();
        const { productId, updates } = await req.json();

        await db.collection('products').updateOne(
            { _id: new ObjectId(productId) },
            { $set: { ...updates, updatedAt: new Date() } }
        );
        
        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { db } = await connectToDatabase();
        const { productId } = await req.json();
        
        await db.collection('products').deleteOne({ 
            _id: new ObjectId(productId) 
        });
        
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
} 