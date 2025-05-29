import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export const Header = () => {
    const { state } = useCart();
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                        Omkar's Store
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-gray-800">
                            Products
                        </Link>
                        <Link href="/cart" className="relative group">
                            <span className="text-gray-600 hover:text-gray-800">Cart</span>
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};
