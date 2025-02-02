'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    sku: string;
};

export default function ProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const router = useRouter();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${params.id}`);
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error);
            
            setProduct({
                ...data.product,
                id: data.product._id
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (value: number) => {
        if (value < 1) return;
        setQuantity(value);
    };

    const handleAddToCart = () => {
        if (!product) return;
        
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images[0]
        });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Loading product details...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">Error: {error}</p>
        </div>
    );

    if (!product) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <div className="relative h-[500px] w-full">
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            
                            {/* Thumbnail Images */}
                            {product.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden
                                                ${selectedImage === index ? 'ring-2 ring-black' : ''}`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold">{product.name}</h1>
                                    <p className="text-gray-600 mt-2">{product.category}</p>
                                </div>
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className="text-2xl"
                                >
                                    {isWishlisted ? (
                                        <FaHeart className="text-red-500" />
                                    ) : (
                                        <FaRegHeart className="text-gray-400 hover:text-red-500" />
                                    )}
                                </button>
                            </div>

                            <div className="border-t border-b py-4">
                                <p className="text-3xl font-bold">£{product.price.toFixed(2)}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-2">Description</h2>
                                <p className="text-gray-600">{product.description}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="font-medium">Quantity:</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            className="px-3 py-1 border rounded-md hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                            className="w-16 text-center border rounded-md py-1"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            className="px-3 py-1 border rounded-md hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 