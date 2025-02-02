'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type UserDetails = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    postcode: string;
    phone: string;
};

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const { login, register, user } = useAuth();
    const router = useRouter();

    const [userDetails, setUserDetails] = useState<UserDetails>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        postcode: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            const redirectPath = sessionStorage.getItem('redirectAfterAuth');
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterAuth');
                router.push(redirectPath);
            } else {
                router.push('/profile');
            }
        }
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                await login(userDetails.email, userDetails.password);
            } else {
                console.log('Submitting registration:', { ...userDetails, password: '***' });
                await register(userDetails);
            }
            router.push('/profile');
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    {isLogin ? 'Sign in to your account' : 'Create new account'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                            {error}
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={userDetails.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={userDetails.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            value={userDetails.firstName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            value={userDetails.lastName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={userDetails.phone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                                        Address Line 1
                                    </label>
                                    <input
                                        id="address1"
                                        name="address1"
                                        type="text"
                                        required
                                        value={userDetails.address1}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                                        Address Line 2 (Optional)
                                    </label>
                                    <input
                                        id="address2"
                                        name="address2"
                                        type="text"
                                        value={userDetails.address2}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            required
                                            value={userDetails.city}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                                            Postcode
                                        </label>
                                        <input
                                            id="postcode"
                                            name="postcode"
                                            type="text"
                                            required
                                            value={userDetails.postcode}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                {isLogin ? 'Sign in' : 'Register'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 