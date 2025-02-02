import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
    req: Request
) {
    const { db } = await connectToDatabase();
    const id = req.url.split('/').pop();
    
    try {
        const result = await db.collection('blog_posts').deleteOne({
            _id: new ObjectId(id)
        });

        if (!result.deletedCount) {
            return new NextResponse('Post not found', { status: 404 });
        }

        return new NextResponse('Deleted', { status: 200 });
    } catch {
        return new NextResponse('Error', { status: 500 });
    }
} 