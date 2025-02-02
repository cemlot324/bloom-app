'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

type Order = {
    _id: string;
    orderNumber: string;
    userId: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    shippingDetails: {
        address1: string;
        address2?: string;
        city: string;
        postcode: string;
    };
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
};

const StatusBadge = ({ status, onStatusChange }: { 
    status: OrderStatus; 
    onStatusChange: (newStatus: OrderStatus) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const statusConfigs = {
        pending: {
            color: 'bg-yellow-100 text-yellow-800',
            icon: '🕒',
            label: 'Pending'
        },
        processing: {
            color: 'bg-blue-100 text-blue-800',
            icon: '⚙️',
            label: 'Processing'
        },
        shipped: {
            color: 'bg-purple-100 text-purple-800',
            icon: '📦',
            label: 'Shipped'
        },
        delivered: {
            color: 'bg-green-100 text-green-800',
            icon: '✅',
            label: 'Delivered'
        },
        cancelled: {
            color: 'bg-red-100 text-red-800',
            icon: '❌',
            label: 'Cancelled'
        }
    };

    const config = statusConfigs[status];

    if (isEditing) {
        return (
            <div className="relative">
                <div className="absolute top-0 right-0 mt-8 bg-white rounded-lg shadow-lg border p-2 z-10 w-48">
                    {(Object.keys(statusConfigs) as OrderStatus[]).map((statusKey) => (
                        <button
                            key={statusKey}
                            onClick={() => {
                                onStatusChange(statusKey);
                                setIsEditing(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                                statusKey === status ? statusConfigs[statusKey].color : 'hover:bg-gray-50'
                            } flex items-center gap-2`}
                        >
                            <span>{statusConfigs[statusKey].icon}</span>
                            {statusConfigs[statusKey].label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            className={`px-3 py-1 rounded-full ${config.color} flex items-center gap-2 text-sm hover:opacity-80 transition-opacity`}
        >
            <span>{config.icon}</span>
            {config.label}
        </button>
    );
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/orders');
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');

            setOrders(data.orders || []);
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to update order');

            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: newStatus }
                        : order
                )
            );
        } catch (err: any) {
            console.error('Error updating order:', err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Order Management</h1>
                        <div className="space-x-4">
                            <Link 
                                href="/admin"
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                                ← Back to Dashboard
                            </Link>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                                className="border rounded-md px-3 py-2"
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading orders...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8">No orders found</div>
                    ) : (
                        <div className="space-y-6">
                            {orders
                                .filter(order => statusFilter === 'all' || order.status === statusFilter)
                                .map((order) => (
                                    <div 
                                        key={order._id}
                                        className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Customer: {order.user.firstName} {order.user.lastName}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Email: {order.user.email}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium mb-2">£{order.totalAmount.toFixed(2)}</p>
                                                <StatusBadge 
                                                    status={order.status}
                                                    onStatusChange={(newStatus) => updateOrderStatus(order._id, newStatus)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="font-medium mb-2">Order Items</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3">
                                                        <div className="relative h-16 w-16 flex-shrink-0">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover rounded-md"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{item.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {item.quantity} × £{item.price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 