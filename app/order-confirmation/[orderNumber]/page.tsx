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
    shippingDetails: {
        firstName: string;
        lastName: string;
        email: string;
        address1: string;
        address2?: string;
        city: string;
        postcode: string;
    };
    totalAmount: number;
    createdAt: string;
};

export default function OrderConfirmationPage({ 
    params 
}: { 
    params: { orderNumber: string } 
}) {
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [params.orderNumber]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${params.orderNumber}`);
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error);
            
            setOrder(data.order);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-center mb-8">
                        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
                        <p className="text-gray-600 mt-2">
                            Order Number: {order.orderNumber}
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-6">
                        {/* Items */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-20 w-20 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-gray-500">
                                                {item.quantity} × £{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-medium">
                                            £{(item.quantity * item.price).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Name</p>
                                    <p className="font-medium">
                                        {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Email</p>
                                    <p className="font-medium">{order.shippingDetails.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Phone</p>
                                    <p className="font-medium">{order.shippingDetails.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Address</p>
                                    <p className="font-medium">
                                        {order.shippingDetails.address1}
                                        {order.shippingDetails.address2 && <br />}
                                        {order.shippingDetails.address2}
                                        <br />
                                        {order.shippingDetails.city}, {order.shippingDetails.postcode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>£{order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-4">
                                <span>Total</span>
                                <span>£{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link 
                            href="/"
                            className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 