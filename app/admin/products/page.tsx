'use client';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Image from 'next/image';

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'Skin Care' | 'Serums' | 'Overnight Care';
    sku: string;
    images: string[];
    createdAt: string;
};

const CATEGORIES = ['Skin Care', 'Serums', 'Overnight Care'];

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error);
            
            setProducts(data.products.map((product: any) => ({
                ...product,
                id: product._id,
                createdAt: new Date(product.createdAt).toLocaleDateString()
            })));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price') as string),
            category: formData.get('category'),
            images: imageUrls,
            ...(selectedProduct && { sku: selectedProduct.sku })
        };

        try {
            const res = await fetch('/api/admin/products', {
                method: selectedProduct ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    selectedProduct 
                        ? { productId: selectedProduct.id, updates: productData }
                        : productData
                )
            });

            if (!res.ok) throw new Error('Failed to save product');

            fetchProducts();
            setShowModal(false);
            setSelectedProduct(null);
            setImageUrls([]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch('/api/admin/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });

            if (!res.ok) throw new Error('Failed to delete product');

            setProducts(products.filter(product => product.id !== productId));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to upload images');

            const data = await res.json();
            setImageUrls(prev => [...prev, ...data.urls]);
        } catch (err) {
            setError('Failed to upload images');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Product Management</h1>
                <button
                    onClick={() => {
                        setSelectedProduct(null);
                        setImageUrls([]);
                        setShowModal(true);
                    }}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center gap-2"
                >
                    <FaPlus /> Add Product
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 relative flex-shrink-0">
                                            <Image
                                                src={product.images[0] || '/placeholder.png'}
                                                alt={product.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    £{product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.sku}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setImageUrls(product.images);
                                            setShowModal(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Product Images
                                </label>
                                <div className="mt-1 flex gap-4 mb-2">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className="relative h-20 w-20">
                                            <Image
                                                src={url}
                                                alt={`Product image ${index + 1}`}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImageUrls(urls => urls.filter((_, i) => i !== index))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className={`mt-1 ${uploading ? 'opacity-50' : ''}`}
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm text-gray-500">Uploading...</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    defaultValue={selectedProduct?.name}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    defaultValue={selectedProduct?.description}
                                    required
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Price
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        defaultValue={selectedProduct?.price}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        defaultValue={selectedProduct?.category}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                    >
                                        <option value="">Select a category</option>
                                        {CATEGORIES.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {selectedProduct && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        SKU
                                    </label>
                                    <input
                                        value={selectedProduct.sku}
                                        disabled
                                        className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-50"
                                    />
                                </div>
                            )}

                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedProduct(null);
                                        setImageUrls([]);
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                                >
                                    {selectedProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 