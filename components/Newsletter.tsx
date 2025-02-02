'use client';
import { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter signup logic here
        console.log('Newsletter signup:', email);
        setEmail('');
    };

    return (
        <section className="py-20 px-12 bg-black text-white">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold mb-4">Join the Bloomed Family</h2>
                    <p className="text-gray-300 mb-8">
                        Subscribe to our newsletter and get 10% off your first order, 
                        plus stay updated with our latest collections and exclusive offers.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="w-full max-w-md">
                        <div className="flex gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-full bg-transparent border-2 border-white focus:outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Subscribe
                            </button>
                        </div>
                    </form>
                    
                    <p className="text-sm text-gray-400 mt-4">
                        By subscribing, you agree to receive marketing emails from Bloomed.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter; 