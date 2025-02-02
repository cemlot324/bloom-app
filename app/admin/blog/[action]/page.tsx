'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type BlogPost = {
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: 'new-products' | 'tips' | 'skincare-guide' | 'news';
    coverImage: string;
    author: string;
    tags: string[];
};

export default function BlogEditor({ params }: { params: Promise<{ action: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const isEditing = resolvedParams.action !== 'new';
    
    const [post, setPost] = useState<BlogPost>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'news',
        coverImage: '',
        author: '',
        tags: []
    });
    const [loading, setLoading] = useState(isEditing);
    const [error, setError] = useState('');
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (isEditing) {
            fetchPost();
        }
    }, [isEditing]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/admin/blog/${resolvedParams.action}`);
            const data = await res.json();
            if (data.post) {
                setPost(data.post);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Failed to fetch post');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing 
                ? `/api/admin/blog/${resolvedParams.action}`
                : '/api/admin/blog';
            
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (!res.ok) throw new Error('Failed to save post');

            router.push('/admin/blog');
        } catch (error) {
            console.error('Error saving post:', error);
            setError('Failed to save post');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Create a base64 version of the image for preview and storage
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

            // Update the post state with the base64 image
            setPost({ ...post, coverImage: base64 });
        } catch (error) {
            console.error('Error handling image:', error);
            setError('Failed to upload image');
        }
    };

    const addTag = () => {
        if (newTag && !post.tags.includes(newTag)) {
            setPost({ ...post, tags: [...post.tags, newTag] });
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setPost({ ...post, tags: post.tags.filter(tag => tag !== tagToRemove) });
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">
                            {isEditing ? 'Edit Post' : 'Create New Post'}
                        </h1>
                        <Link 
                            href="/admin/blog"
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Blog Management
                        </Link>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={post.title}
                                onChange={(e) => setPost({ ...post, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={post.category}
                                onChange={(e) => setPost({ ...post, category: e.target.value as any })}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            >
                                <option value="new-products">New Products</option>
                                <option value="tips">Tips & Tricks</option>
                                <option value="skincare-guide">Skincare Guide</option>
                                <option value="news">News</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full"
                            />
                            {post.coverImage && (
                                <div className="mt-2 relative h-40 w-full">
                                    <Image
                                        src={post.coverImage}
                                        alt="Cover"
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                value={post.excerpt}
                                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                            </label>
                            <textarea
                                value={post.content}
                                onChange={(e) => setPost({ ...post, content: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                                rows={10}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    className="flex-grow px-4 py-2 border rounded-md"
                                    placeholder="Add a tag"
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                            >
                                {isEditing ? 'Update Post' : 'Create Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 