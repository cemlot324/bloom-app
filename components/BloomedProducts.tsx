'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaStar, FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRouter } from 'next/navigation';

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    isNew?: boolean;
};

const BloomedProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const router = useRouter();

    const filters = ["All", "Skin Care", "Serums", "Overnight Care"];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error);
            
            setProducts(data.products.map((product: any) => ({
                ...product,
                id: product._id,
                isNew: isNewProduct(product.createdAt)
            })));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isNewProduct = (createdAt: string) => {
        const productDate = new Date(createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return productDate >= thirtyDaysAgo;
    };

    const handleWishlist = async (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await toggleWishlist(productId);
        } catch (error: any) {
            if (error.message.includes('Please login')) {
                router.push('/auth');
            }
        }
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0]
        });
    };

    const filteredProducts = products.filter(product => 
        activeFilter === 'All' || product.category === activeFilter
    );

    if (loading) return (
        <div className="py-16 px-12 bg-gray-50">
            <div className="max-w-[1400px] mx-auto">
                <p>Loading products...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="py-16 px-12 bg-gray-50">
            <div className="max-w-[1400px] mx-auto">
                <p className="text-red-500">Error: {error}</p>
            </div>
        </div>
    );

    return (
        <section className="py-16 px-12 bg-gray-50">
            <div className="max-w-[1400px] mx-auto">
                {/* Header and Filters */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-6 text-left">Bloomed Products</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors whitespace-nowrap
                                    ${activeFilter === filter ? 'bg-black text-white' : 'text-black'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative flex flex-col h-full">
                                {product.isNew && (
                                    <div className="absolute top-0 left-0 z-10 bg-black text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                                        <FaStar className="text-white" />
                                        NEW
                                    </div>
                                )}
                                
                                <button 
                                    onClick={(e) => handleWishlist(e, product.id)}
                                    className={`absolute top-0 right-0 z-20 text-2xl transition-colors p-2
                                        ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    <FaHeart />
                                </button>

                                <Link 
                                    href={`/product/${product.id}`}
                                    className="flex flex-col flex-grow"
                                >
                                    <div className="relative h-[400px] w-full mb-6">
                                        <Image
                                            src={product.images[0] || '/placeholder.png'}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-medium text-xl">{product.name}</h3>
                                        <span className="font-bold text-xl">£{product.price.toFixed(2)}</span>
                                    </div>
                                </Link>

                                <button 
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="w-full py-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Products Message */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products found in this category.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BloomedProducts; 