import Header from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <CartProvider>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <ToastContainer />
                    <Component {...pageProps} />
                </div>
            </CartProvider>
        </AuthProvider>
    );
}
