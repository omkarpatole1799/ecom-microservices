import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
    const { state, dispatch } = useCart();
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const fallbackImageUrl =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNODAgNjBIMTIwVjE0MEg4MFY2MFoiIGZpbGw9IiM5Q0EzQUYiLz48cGF0aCBkPSJNMTAwIDkwQzEwNS41MjMgOTAgMTEwIDg1LjUyMjggMTEwIDgwQzExMCA3NC40NzcyIDEwNS41MjMgNzAgMTAwIDcwQzk0LjQ3NzIgNzAgOTAgNzQuNDc3MiA5MCA4MEM5MCA4NS41MjI4IDk0LjQ3NzIgOTAgMTAwIDkwWiIgZmlsbD0iI0U1RTdFQiIvPjxwYXRoIGQ9Ik04NSAxMDBMMTAwIDEyMEwxMTUgMTAwSDg1WiIgZmlsbD0iI0U1RTdFQiIvPjwvc3ZnPg==';

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
        } else {
            dispatch({
                type: 'UPDATE_QUANTITY',
                payload: { id: productId, quantity: newQuantity },
            });
        }
    };

    const handleRemoveItem = (productId: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    };

    const handleImageError = (productId: string) => {
        setImageErrors((prev) => ({ ...prev, [productId]: true }));
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Add some products to your cart to continue shopping
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {state.items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center gap-4">
                                <div className="relative h-24 w-24 flex-shrink-0">
                                    <Image
                                        src={
                                            imageErrors[item.id]
                                                ? fallbackImageUrl
                                                : item.image || fallbackImageUrl
                                        }
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-md"
                                        onError={() => handleImageError(item.id)}
                                        priority
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-600">${item.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            handleUpdateQuantity(item.id, item.quantity - 1)
                                        }
                                        className="p-1 rounded-md hover:bg-gray-100">
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            handleUpdateQuantity(item.id, item.quantity + 1)
                                        }
                                        className="p-1 rounded-md hover:bg-gray-100">
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${state.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>${state.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
