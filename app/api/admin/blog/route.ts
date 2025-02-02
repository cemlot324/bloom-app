import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        
        const posts = await db.collection('blog_posts')
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { db } = await connectToDatabase();
        const postData = await req.json();

        const result = await db.collection('blog_posts').insertOne({
            ...postData,
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ 
            success: true, 
            postId: result.insertedId 
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
} 