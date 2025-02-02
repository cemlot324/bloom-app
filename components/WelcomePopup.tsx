'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const WelcomePopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has seen the popup before
        const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
        
        if (!hasSeenPopup) {
            setIsOpen(true);
            localStorage.setItem('hasSeenWelcomePopup', 'true');
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full relative">
                {/* Close Button */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Popup Content */}
                <div className="p-8">
                    <div className="relative h-48 mb-6">
                        <Image
                            src="/Image1.png"
                            alt="Special Offer"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Welcome to Bloomed!</h2>
                    <p className="text-gray-600 mb-4">
                        Get 20% off your first purchase with code:
                    </p>
                    <div className="bg-gray-100 p-3 text-center rounded-lg mb-6">
                        <span className="font-bold text-xl">WELCOME20</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Shop Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePopup; 