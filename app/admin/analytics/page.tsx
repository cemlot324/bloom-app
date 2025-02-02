'use client';
import { useState, useEffect } from 'react';
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import Link from 'next/link';

type AnalyticsData = {
    salesByMonth: {
        month: string;
        sales: number;
        revenue: number;
    }[];
    topCategories: {
        category: string;
        count: number;
        revenue: number;
    }[];
    customerStats: {
        totalCustomers: number;
        newCustomers: number;
        returningCustomers: number;
    };
};

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/admin/analytics');
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading analytics...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
    if (!data) return <div className="text-center py-8">No data available</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                        <Link 
                            href="/admin"
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {/* Monthly Sales Chart */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FaChartLine className="text-blue-500" />
                            Monthly Sales
                        </h2>
                        <div className="h-80 bg-gray-50 rounded-lg p-4">
                            {/* Add your preferred charting library here */}
                            {/* Example: Chart showing monthly sales data */}
                        </div>
                    </div>

                    {/* Category Performance */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FaChartBar className="text-green-500" />
                            Category Performance
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.topCategories.map((category) => (
                                <div key={category.category} className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium mb-2">{category.category}</h3>
                                    <p className="text-sm text-gray-600">
                                        Sales: {category.count}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Revenue: £{category.revenue.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Analytics */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FaChartPie className="text-purple-500" />
                            Customer Analytics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium mb-2">Total Customers</h3>
                                <p className="text-2xl font-bold">{data.customerStats.totalCustomers}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium mb-2">New Customers</h3>
                                <p className="text-2xl font-bold">{data.customerStats.newCustomers}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium mb-2">Returning Customers</h3>
                                <p className="text-2xl font-bold">{data.customerStats.returningCustomers}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 