import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/types/product';

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: Product }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItem = state.items.find((item) => item.id === action.payload.id);

            if (existingItem) {
                const updatedItems = state.items.map((item) =>
                    item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
                );
                return {
                    ...state,
                    items: updatedItems,
                    total: calculateTotal(updatedItems),
                };
            }

            const newItems = [...state.items, { ...action.payload, quantity: 1 }];
            return {
                ...state,
                items: newItems,
                total: calculateTotal(newItems),
            };
        }

        case 'REMOVE_FROM_CART': {
            const newItems = state.items.filter((item) => item.id !== action.payload);
            return {
                ...state,
                items: newItems,
                total: calculateTotal(newItems),
            };
        }

        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map((item) =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            return {
                ...state,
                items: updatedItems,
                total: calculateTotal(updatedItems),
            };
        }

        case 'CLEAR_CART':
            return {
                items: [],
                total: 0,
            };

        default:
            return state;
    }
};

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        total: 0,
    });

    return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
