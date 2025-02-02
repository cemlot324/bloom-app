'use client';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const handleCheckout = () => {
        if (!user) {
            sessionStorage.setItem('redirectAfterAuth', '/checkout');
            router.push('/auth');
        } else {
            router.push('/checkout');
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                        <Link 
                            href="/" 
                            className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-grow">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                                <button
                                    onClick={clearCart}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Clear Cart
                                </button>
                            </div>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="flex items-center gap-4 p-4 border rounded-lg"
                                    >
                                        {/* Product Image */}
                                        <div className="relative h-24 w-24 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <Link 
                                                href={`/product/${item.id}`}
                                                className="font-medium hover:text-gray-600"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-gray-500">£{item.price.toFixed(2)}</p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:text-gray-600"
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:text-gray-600"
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="w-24 text-right">
                                            <p className="font-medium">
                                                £{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link 
                            href="/"
                            className="text-gray-600 hover:text-black flex items-center gap-2"
                        >
                            <span>←</span> Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>£{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                            </div>
                            
                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>£{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                className="w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 