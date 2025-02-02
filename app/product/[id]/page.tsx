import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import ProductView from './ProductView';
import { Metadata } from 'next';

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProductView />
            </div>
        </div>
    );
} 