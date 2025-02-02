'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { FaShoppingBag, FaTimes } from 'react-icons/fa';

export default function CartNotification() {
    const [showNotification, setShowNotification] = useState(false);
    const { items } = useCart();
    const [lastItemCount, setLastItemCount] = useState(items.length);

    useEffect(() => {
        // Check if items were added to cart
        if (items.length > lastItemCount) {
            // Set a timeout for 2 minutes
            const timer = setTimeout(() => {
                setShowNotification(true);
            }, 2 * 60 * 1000); // 2 minutes in milliseconds

            // Cleanup timeout if component unmounts or items change again
            return () => clearTimeout(timer);
        }
        // Update last item count
        setLastItemCount(items.length);
    }, [items.length, lastItemCount]);

    const closeNotification = () => {
        setShowNotification(false);
    };

    if (!showNotification || items.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm border border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-center">
                        <div className="bg-black rounded-full p-2 mr-3">
                            <FaShoppingBag className="text-white text-lg" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">
                                Don't forget your items!
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                You have {items.length} {items.length === 1 ? 'item' : 'items'} waiting in your cart.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={closeNotification}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="mt-3">
                    <a
                        href="/cart"
                        className="block w-full bg-black text-white text-center py-2 px-4 rounded-md hover:bg-gray-800 transition-colors text-sm"
                    >
                        View Cart
                    </a>
                </div>
            </div>
        </div>
    );
} 