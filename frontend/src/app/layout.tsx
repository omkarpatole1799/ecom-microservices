'use client';

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <CartProvider>
                        <Header />
                        <main className="min-h-screen bg-gray-50 py-6">{children}</main>
                        <ToastContainer />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
