'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Image from 'next/image';

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

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/blog');
            const data = await res.json();
            setPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (postId: string) => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/blog/${postId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete post');
            }

            setPosts(posts.filter(post => post._id !== postId));

            alert('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Blog Management</h1>
                        <div className="space-x-4">
                            <Link 
                                href="/admin"
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                                ← Back to Dashboard
                            </Link>
                            <Link
                                href="/admin/blog/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                            >
                                <FaPlus />
                                New Post
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading posts...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Post
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {posts.map((post) => (
                                        <tr key={post._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="relative h-10 w-10 flex-shrink-0">
                                                        <Image
                                                            src={post.coverImage}
                                                            alt={post.title}
                                                            fill
                                                            className="object-cover rounded-md"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {post.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            By {post.author}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={`/admin/blog/edit/${post._id}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    <FaEdit className="inline-block" />
                                                </Link>
                                                <button
                                                    onClick={() => deletePost(post._id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    <FaTrash className="inline-block" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 