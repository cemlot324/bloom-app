'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <Image
            src="/BloomLogo2.png"
            alt="Bloom Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-black mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for seems to have vanished like your favorite skincare product on sale.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <FaHome />
            Back to Home
          </Link>
          <Link 
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-black text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaSearch />
            Browse Products
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help finding something?</p>
          <Link 
            href="/contact"
            className="text-black underline hover:text-gray-800"
          >
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
} 