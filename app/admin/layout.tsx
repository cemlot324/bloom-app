'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Check if user is authorized
        const checkAuth = () => {
            const auth = sessionStorage.getItem('adminAuth');
            if (!auth) {
                router.push('/');
            } else {
                setIsAuthorized(true);
            }
        };

        checkAuth();
    }, [router]);

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white p-6">
                <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
                <nav className="space-y-4">
                    <Link 
                        href="/admin"
                        className="block py-2 px-4 rounded hover:bg-gray-800"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        href="/admin/users"
                        className="block py-2 px-4 rounded hover:bg-gray-800"
                    >
                        User Management
                    </Link>
                    <Link 
                        href="/admin/products"
                        className="block py-2 px-4 rounded hover:bg-gray-800"
                    >
                        Product Management
                    </Link>
                    <Link 
                        href="/admin/analytics"
                        className="block py-2 px-4 rounded hover:bg-gray-800"
                    >
                        Analytics
                    </Link>
                    <Link 
                        href="/admin/orders"
                        className="block py-2 px-4 rounded hover:bg-gray-800"
                    >
                        Order Management
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-100">
                {children}
            </main>
        </div>
    );
} 