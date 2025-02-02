import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const defaultPosts = [
    {
        _id: '1',
        title: 'New Skincare Collection Launch',
        slug: 'new-skincare-collection',
        excerpt: 'Discover our latest skincare collection designed for sensitive skin...',
        content: 'Full content here...',
        category: 'new-products',
        coverImage: '/images/blog/skincare-collection.jpg',
        author: 'Sarah Johnson',
        createdAt: new Date().toISOString(),
        tags: ['skincare', 'new-products', 'sensitive-skin']
    },
    // Add more default posts as needed
];

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        
        // Fetch all blog posts and sort by creation date
        const posts = await db.collection('blog_posts')
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        // Format the posts for the frontend
        const formattedPosts = posts.map(post => ({
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
        }));

        return NextResponse.json({ posts: formattedPosts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
} 