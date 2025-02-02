'use client';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState, useEffect } from 'react';

type WishlistProduct = {
    id: string;
    name: string;
    price: number;
    images: string[];
};

const Navbar = () => {
  const { user } = useAuth();
  const { items, totalItems, totalPrice } = useCart();
  const { wishlist } = useWishlist();
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([]);

  // Fetch wishlist products when wishlist changes
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const productPromises = Array.from(wishlist).map(async (productId) => {
          const res = await fetch(`/api/products/${productId}`);
          const data = await res.json();
          return {
            id: data.product._id,
            name: data.product.name,
            price: data.product.price,
            images: data.product.images,
          };
        });
        const products = await Promise.all(productPromises);
        setWishlistProducts(products);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      }
    };

    if (wishlist.size > 0) {
      fetchWishlistProducts();
    } else {
      setWishlistProducts([]);
    }
  }, [wishlist]);

  return (
    <nav className="flex justify-between items-center px-12 py-2 bg-white shadow-md">
      <Link href="/">
        <div className="relative h-16 w-16 cursor-pointer">
          <Image 
            src="/BloomLogo2.png" 
            alt="Bloom Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>
      </Link>
      
      <div className="flex items-center w-[60%]">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none"
        />
        <button 
          type="submit"
          className="px-4 py-2.5 bg-black text-white rounded-full -ml-12 hover:bg-gray-800"
        >
          <i className="fas fa-search"></i>
        </button>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex gap-4 items-center">
          <Link 
            href="/updates" 
            className="text-gray-800 hover:text-black transition-colors font-bold"
          >
            BLOOMED
          </Link>
          <i className="fas fa-truck text-xl cursor-pointer hover:text-gray-600"></i>
          <Link href={user ? '/profile' : '/auth'}>
            <i className="fas fa-user text-xl cursor-pointer hover:text-gray-600"></i>
          </Link>
          <div 
            className="relative"
            onMouseEnter={() => setShowWishlistPreview(true)}
            onMouseLeave={() => setShowWishlistPreview(false)}
          >
            <i className="fas fa-heart text-xl cursor-pointer hover:text-gray-600"></i>
            {wishlist.size > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlist.size}
              </span>
            )}

            {/* Wishlist Preview Dropdown */}
            {showWishlistPreview && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 p-4">
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Your wishlist is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto">
                      {wishlistProducts.map((product) => (
                        <Link 
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="flex items-center gap-3 py-2 border-b hover:bg-gray-50"
                        >
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-gray-500 text-sm">
                              £{product.price.toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Link 
                        href="/profile?tab=wishlist"
                        className="block w-full py-2 text-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm"
                      >
                        View Wishlist
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div 
            className="relative"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <Link href="/cart">
              <i className="fas fa-shopping-bag text-xl cursor-pointer hover:text-gray-600"></i>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Cart Preview Dropdown */}
            {showCartPreview && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 p-4">
                {items.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-gray-500 text-sm">
                              {item.quantity} × £{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium">Total:</span>
                        <span className="font-medium">£{totalPrice.toFixed(2)}</span>
                      </div>
                      <Link 
                        href="/cart"
                        className="block w-full py-2 text-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm"
                      >
                        View Cart
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;