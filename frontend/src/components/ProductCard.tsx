import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);

    const fallbackImageUrl =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNODAgNjBIMTIwVjE0MEg4MFY2MFoiIGZpbGw9IiM5Q0EzQUYiLz48cGF0aCBkPSJNMTAwIDkwQzEwNS41MjMgOTAgMTEwIDg1LjUyMjggMTEwIDgwQzExMCA3NC40NzcyIDEwNS41MjMgNzAgMTAwIDcwQzk0LjQ3NzIgNzAgOTAgNzQuNDc3MiA5MCA4MEM5MCA4NS41MjI4IDk0LjQ3NzIgOTAgMTAwIDkwWiIgZmlsbD0iI0U1RTdFQiIvPjxwYXRoIGQ9Ik04NSAxMDBMMTAwIDEyMEwxMTUgMTAwSDg1WiIgZmlsbD0iI0U1RTdFQiIvPjwvc3ZnPg==';

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
                <span className="text-sm text-gray-600">Stock: {product.stock}</span>
            </div>
            <button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className="mt-auto w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}
