'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axiosInstance, { API_PATHS } from '@/lib/axios';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: string;
    name?: string | null;
    email: string;
    role: string;
    image?: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data } = await axiosInstance.get(API_PATHS.AUTH.ME);
            setUser(data.user);
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData: any) => {
        const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
        if (data.success) {
            setUser(data.user);
            router.push('/dashboard');
        }
    };

    const register = async (formData: any) => {
        const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
        if (data.success) {
            setUser(data.user);
            router.push('/dashboard');
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
            setUser(null);
            router.push('/auth');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    useEffect(() => {
        if (!loading && !user && pathname.startsWith('/dashboard')) {
            router.push('/auth');
        }
    }, [user, loading, pathname, router]);


    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
