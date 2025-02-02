'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaUser, FaTag } from 'react-icons/fa';

type BlogPost = {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: 'new-products' | 'tips' | 'skincare-guide' | 'news';
    coverImage: string;
    author: string;
    createdAt: string;
    tags: string[];
};

export default function UpdatesPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/blog-posts');
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');

            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', name: 'All Updates' },
        { id: 'new-products', name: 'New Products' },
        { id: 'tips', name: 'Tips & Tricks' },
        { id: 'skincare-guide', name: 'Skincare Guide' },
        { id: 'news', name: 'News' }
    ];

    const filteredPosts = activeCategory === 'all' 
        ? posts 
        : posts.filter(post => post.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        BLOOMED Updates
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover the latest skincare products, tips, and expert advice for your beauty journey
                    </p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                                ${activeCategory === category.id
                                    ? 'bg-black text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Blog Posts Grid */}
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <article
                                key={post._id}
                                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Link href={`/updates/${post.slug}`}>
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <FaClock className="text-gray-400" />
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaUser className="text-gray-400" />
                                                {post.author}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600"
                                                >
                                                    <FaTag className="text-gray-400" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 