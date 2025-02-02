'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUser, FaShoppingBag, FaHeart, FaBox, FaTruck, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

type TabType = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'tracking';

type OrderItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

type Order = {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
};

type WishlistProduct = {
    _id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
};

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<TabType>(searchParams.get('tab') || 'profile');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([]);

    useEffect(() => {
        if (!user) {
            router.push('/auth');
            return;
        }
        if (activeTab === 'orders') {
            fetchOrders();
        }
        if (activeTab === 'wishlist') {
            fetchWishlistProducts();
        }
    }, [user, activeTab, router, wishlist]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/orders/user', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/auth');
                    return;
                }
                throw new Error(data.error);
            }

            // Ensure orders is an array and has the expected shape
            const formattedOrders = Array.isArray(data.orders) ? data.orders : [];
            setOrders(formattedOrders);
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlistProducts = async () => {
        try {
            setLoading(true);
            const productPromises = Array.from(wishlist).map(async (productId) => {
                const res = await fetch(`/api/products/${productId}`);
                const data = await res.json();
                return data.product;
            });
            const products = await Promise.all(productPromises);
            setWishlistProducts(products);
        } catch (error) {
            console.error('Error fetching wishlist products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleRemoveFromWishlist = (productId: string) => {
        removeFromWishlist(productId);
    };

    const handleMoveToCart = async (product: WishlistProduct) => {
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
        removeFromWishlist(product._id);
    };

    if (!user) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <p className="mt-1 p-2 block w-full bg-gray-50 rounded-md">{user.firstName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <p className="mt-1 p-2 block w-full bg-gray-50 rounded-md">{user.lastName}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 p-2 block w-full bg-gray-50 rounded-md">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <p className="mt-1 p-2 block w-full bg-gray-50 rounded-md">{user.phone}</p>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Order History</h2>
                        
                        {renderOrders()}
                    </div>
                );
            case 'wishlist':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                        {loading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : wishlistProducts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                                <Link
                                    href="/products"
                                    className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlistProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <Link href={`/product/${product._id}`}>
                                            <div className="relative h-48 w-full">
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>
                                        <div className="p-4">
                                            <h3 className="font-medium text-lg mb-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                £{product.price.toFixed(2)}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleMoveToCart(product)}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm"
                                                >
                                                    <FaShoppingCart />
                                                    Add to Cart
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                                    className="p-2 text-red-500 hover:text-red-600 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'addresses':
                return (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium mb-2">Primary Address</h3>
                            <p className="text-gray-600">{user.address1}</p>
                            {user.address2 && <p className="text-gray-600">{user.address2}</p>}
                            <p className="text-gray-600">{user.city}</p>
                            <p className="text-gray-600">{user.postcode}</p>
                        </div>
                        <button className="text-black hover:text-gray-700">
                            + Add New Address
                        </button>
                    </div>
                );
            case 'tracking':
                return (
                    <div className="space-y-4">
                        <p className="text-gray-500">No active shipments</p>
                        {/* Add tracking information here */}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderOrders = () => {
        if (loading) return <div className="text-center py-8">Loading orders...</div>;
        if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
        if (!orders.length) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <Link 
                        href="/"
                        className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div 
                        key={order._id}
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <Link 
                                    href={`/order-confirmation/${order.orderNumber}`}
                                    className="text-lg font-medium hover:text-gray-600"
                                >
                                    Order #{order.orderNumber}
                                </Link>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">£{order.totalAmount.toFixed(2)}</p>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {order.items && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                                            <p className="text-gray-500 text-sm">
                                                {item.quantity} × £{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {user.firstName}!</h1>
                        <p className="text-gray-600">Manage your account and view your orders</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                    >
                        Logout
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 bg-white rounded-lg shadow-sm p-4">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                                    activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-50'
                                }`}
                            >
                                <FaUser /> Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                                    activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-50'
                                }`}
                            >
                                <FaShoppingBag /> Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('wishlist')}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                                    activeTab === 'wishlist' ? 'bg-black text-white' : 'hover:bg-gray-50'
                                }`}
                            >
                                <FaHeart /> Wishlist
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                                    activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-50'
                                }`}
                            >
                                <FaBox /> Addresses
                            </button>
                            <button
                                onClick={() => setActiveTab('tracking')}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                                    activeTab === 'tracking' ? 'bg-black text-white' : 'hover:bg-gray-50'
                                }`}
                            >
                                <FaTruck /> Order Tracking
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
} 