import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
    request: Request,
    context: { params: { id: string } }
) {
    const { db } = await connectToDatabase();
    
    try {
        const result = await db.collection('blog_posts').deleteOne({
            _id: new ObjectId(context.params.id)
        });

        if (!result.deletedCount) {
            return new NextResponse('Post not found', { status: 404 });
        }

        return new NextResponse('Deleted', { status: 200 });
    } catch (error) {
        return new NextResponse('Error', { status: 500 });
    }
} 