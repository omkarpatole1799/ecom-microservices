import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { CartProvider } from '@/contexts/CartContext';
import { Header } from '@/components/Header';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Component {...pageProps} />
            </div>
        </CartProvider>
    );
}
