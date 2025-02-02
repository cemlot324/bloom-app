'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBox, FaShoppingBag, FaUsers, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';

type DashboardStats = {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    recentOrders: Array<{
        orderNumber: string;
        date: string;
        status: string;
        amount: number;
    }>;
    topProducts: Array<{
        name: string;
        sales: number;
        revenue: number;
    }>;
};

export default function AdminPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const res = await fetch('/api/admin/dashboard-stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 text-sm">Total Orders</p>
                                    <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
                                </div>
                                <FaShoppingBag className="text-blue-500 text-3xl" />
                            </div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 text-sm">Revenue</p>
                                    <p className="text-2xl font-bold">£{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                                </div>
                                <FaChartLine className="text-green-500 text-3xl" />
                            </div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-600 text-sm">Products</p>
                                    <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
                                </div>
                                <FaBox className="text-purple-500 text-3xl" />
                            </div>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-600 text-sm">Customers</p>
                                    <p className="text-2xl font-bold">{stats?.totalCustomers || 0}</p>
                                </div>
                                <FaUsers className="text-orange-500 text-3xl" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Link 
                            href="/admin/products"
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold mb-2">Manage Products</h3>
                            <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                        </Link>
                        <Link 
                            href="/admin/orders"
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold mb-2">Order Management</h3>
                            <p className="text-sm text-gray-600">View and manage orders</p>
                        </Link>
                        <Link 
                            href="/admin/inventory"
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold mb-2">Inventory</h3>
                            <p className="text-sm text-gray-600">Track stock levels</p>
                        </Link>
                        <Link 
                            href="/admin/customers"
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold mb-2">Customers</h3>
                            <p className="text-sm text-gray-600">View customer details</p>
                        </Link>
                        <Link 
                            href="/admin/blog"
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold mb-2">Blog Management</h3>
                            <p className="text-sm text-gray-600">Manage blog posts and updates</p>
                        </Link>
                    </div>

                    {/* Recent Orders */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats?.recentOrders?.map((order) => (
                                        <tr key={order.orderNumber}>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-gray-100 text-gray-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">£{order.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Top Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats?.topProducts?.map((product) => (
                                <div key={product.name} className="border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">{product.name}</h3>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Sales: {product.sales}</span>
                                        <span>Revenue: £{product.revenue.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 