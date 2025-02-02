import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Params = {
    params: {
        id: string;
    };
};

export async function DELETE(
    _req: Request,
    { params }: Params
) {
    try {
        const { db } = await connectToDatabase();
        
        const result = await db.collection('blog_posts').deleteOne({
            _id: new ObjectId(params.id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
} 