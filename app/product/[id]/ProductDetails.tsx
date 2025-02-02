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

export default function ProductDetails({ productId }: { productId: string }) {
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
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${productId}`);
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

    // Rest of your component code stays the same...
} 