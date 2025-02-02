'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type WishlistContextType = {
    wishlist: Set<string>;
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType>({
    wishlist: new Set(),
    toggleWishlist: async () => {},
    isInWishlist: () => false,
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const { user } = useAuth();

    // Load wishlist when user changes
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist(new Set());
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch('/api/wishlist');
            const data = await res.json();
            if (res.ok) {
                setWishlist(new Set(data.wishlist));
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const toggleWishlist = async (productId: string) => {
        if (!user) {
            throw new Error('Please login to add items to your wishlist');
        }

        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });

            if (!res.ok) throw new Error('Failed to update wishlist');

            const { wishlist: updatedWishlist } = await res.json();
            setWishlist(new Set(updatedWishlist));
        } catch (error) {
            throw error;
        }
    };

    const isInWishlist = (productId: string) => wishlist.has(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext); 