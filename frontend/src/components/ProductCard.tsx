'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { fallbackImageUrl } from '@/helpers/constants';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { addToCart, state } = useCart();
    const isLoading = state.loading;
    const [imageError, setImageError] = useState(false);


    const handleAddToCart = async () => {
        await addToCart(product.id, 1);
        router.push('/cart');
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-3">
            <div className="relative h-48 w-full p-3">
                <Image
                    src={imageError ? fallbackImageUrl : product.image || fallbackImageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                    priority
                />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                <span
                    className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
            </div>
            <button
                onClick={handleAddToCart}
                disabled={isLoading || product.stock === 0}
                className="mt-auto w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                {isLoading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}
