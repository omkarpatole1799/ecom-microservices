'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { FiTrash2 } from 'react-icons/fi';
import OrderSummary from '@/components/OrderSummary';

export default function CartPage() {
    const { state, removeFromCart, updateQuantity, fetchCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const { items, loading } = state;
    console.log(items, '--items');
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">Loading cart...</div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Your cart is empty
                    </h2>
                    <button
                        onClick={() => router.push('/')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                            <div className="relative h-24 w-24 flex-shrink-0">
                                <Image
                                    src={item.image || '/placeholder.png'}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {item.product.name}
                                </h3>
                                <p className="text-gray-600">${item.product?.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item.productId,
                                            Math.max(0, item.quantity - 1),
                                            'REMOVE_ITEM'
                                        )
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                                    -
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item.productId,
                                            item.quantity + 1,
                                            'ADD_ITEM'
                                        )
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.productId)}
                                className="p-2 text-gray-500 hover:text-red-500">
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                        <OrderSummary />
                        <button
                            onClick={() => router.push('/checkout')}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
