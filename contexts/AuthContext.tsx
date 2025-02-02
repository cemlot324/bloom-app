'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
    phone: string;
} | null;

type AuthContextType = {
    user: User;
    login: (email: string, password: string) => Promise<void>;
    register: (userDetails: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        postcode: string;
        phone: string;
    }) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        // Check if user is logged in on mount
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/check', {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setUser(data.user);
            return data.user;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to login');
        }
    };

    const register = async (userDetails: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        postcode: string;
        phone: string;
    }) => {
        console.log('Registering with details:', { ...userDetails, password: '***' });
        
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userDetails, action: 'register' }),
        });

        const data = await res.json();
        
        if (!res.ok) {
            console.error('Registration error:', data);
            throw new Error(data.error);
        }

        console.log('Registration successful:', data);
        const { user } = data;
        setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user));
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 