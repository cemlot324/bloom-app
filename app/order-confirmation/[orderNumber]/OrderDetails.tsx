'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

type OrderDetails = {
    orderNumber: string;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    totalAmount: number;
};

export default function OrderDetails({ orderNumber }: { orderNumber: string }) {
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/orders/${orderNumber}`)
            .then(res => res.json())
            .then(data => setOrder(data.order))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [orderNumber]);

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Order Details</h2>
            {/* Rest of your order details UI */}
        </div>
    );
} 