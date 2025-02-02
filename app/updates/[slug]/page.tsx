'use client';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaUser, FaTag } from 'react-icons/fa';

type BlogPost = {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    coverImage: string;
    author: string;
    createdAt: string;
    tags: string[];
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/blog-posts/${resolvedParams.slug}`);
            const data = await res.json();
            setPost(data.post);
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Failed to fetch post');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
    if (!post) return <div className="text-center py-8">Post not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <Link 
                    href="/updates"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
                >
                    ← Back to Updates
                </Link>

                <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative h-96 w-full">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    <div className="p-8">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                                <FaClock className="text-gray-400" />
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <FaUser className="text-gray-400" />
                                {post.author}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {post.category}
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {post.title}
                        </h1>

                        <div className="prose max-w-none">
                            {post.content.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                                    >
                                        <FaTag className="text-gray-400" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
} 