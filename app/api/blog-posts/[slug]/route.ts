import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { db } = await connectToDatabase();
        
        // Find the specific blog post by slug
        const post = await db.collection('blog_posts').findOne({ 
            slug: params.slug 
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Format the post for the frontend
        const formattedPost = {
            _id: post._id.toString(),
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            coverImage: post.coverImage,
            author: post.author,
            createdAt: post.createdAt,
            tags: post.tags
        };

        return NextResponse.json({ post: formattedPost });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
} 