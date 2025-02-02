'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    sku: string;
};

export default function ProductView() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setProduct(data.product);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Product not found</div>;

    const handleQuantityChange = (value: number) => {
        if (value < 1) return;
        setQuantity(value);
    };

    const handleAddToCart = () => {
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images[0]
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Rest of your UI code */}
            </div>
        </div>
    );
} 