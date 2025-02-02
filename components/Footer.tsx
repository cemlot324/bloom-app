'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Footer = () => {
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleAdminAccess = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '1234') {
            // Store auth state in sessionStorage
            sessionStorage.setItem('adminAuth', 'true');
            // Close modal and clear password
            setPassword('');
            setShowModal(false);
            // Redirect to admin dashboard
            router.push('/admin');
        } else {
            alert('Incorrect password');
            setPassword('');
        }
    };

    return (
        <footer className="bg-black text-white py-8 px-12">
            <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                <p className="text-gray-400">© 2024 Bloomed. All rights reserved.</p>
                <button 
                    onClick={() => setShowModal(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    Admin Access
                </button>
            </div>

            {/* Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-md">
                        <h3 className="text-black text-xl font-bold mb-4">Admin Access</h3>
                        <form onSubmit={handleAdminAccess}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-4 py-2 border rounded mb-4 text-black"
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                >
                                    Access
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer; 