'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { PRODUCT_SERVICE_URL } from '@/helpers/constants';
import { Product } from '@/types/product';

// Types
interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    stock: number;
    product: Product;
}

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

type CartAction =
    | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Context
interface CartContextType {
    state: CartState;
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number, type: string) => Promise<void>;
    clearCart: () => Promise<void>;
    checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'SET_CART_ITEMS':
            return {
                ...state,
                items: action.payload,
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        loading: false,
        error: null,
    });

    console.log(user, '--user=================');

    // Fetch cart items when user changes
    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        console.log('fetchCart');
        if (!user) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await fetch(`${PRODUCT_SERVICE_URL}/cart/${user.id}`);
            if (!response.ok) throw new Error('Failed to fetch cart');
            const data = await response.json();
            dispatch({ type: 'SET_CART_ITEMS', payload: data });
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to fetch cart items');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const addToCart = async (productId: string, quantity: number) => {
        console.log(productId, '-productId==================================');

        if (!user) {
            toast.error('Please login to add items to cart');
            router.push('/login');
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await fetch(`${PRODUCT_SERVICE_URL}/cart/add/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add item to cart');
            }

            const updatedCart = await response.json();
            dispatch({ type: 'SET_CART_ITEMS', payload: updatedCart });
            toast.success('Item added to cart');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add item to cart';
            toast.error(message);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updateQuantity = async (productId: string, quantity: number, type: string) => {
        console.log(productId, quantity, '--productId, quantity');
        if (!user) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            if (quantity === 0) {
                await removeFromCart(productId);
                return;
            }

            const sendData = {
                productId,
                quantity,
                type,
            };
            const url = `${PRODUCT_SERVICE_URL}/cart/update/${user.id}`;
            console.log(url, '--url');

            console.log(sendData, '--sendData');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendData),
            });

            if (!response.ok) {
                const error = await response.json();
                console.log(error, '--error');
                throw new Error(error.message || 'Failed to update quantity');
            }

            const updatedCart = await response.json();
            dispatch({ type: 'SET_CART_ITEMS', payload: updatedCart });
            toast.success('Cart updated');
        } catch (error) {
            console.log(error, '--error');
            const message = error instanceof Error ? error.message : 'Failed to update quantity';
            toast.error(message);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!user) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await fetch(`${PRODUCT_SERVICE_URL}/cart/${user.id}/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to remove item from cart');

            const updatedCart = await response.json();
            dispatch({ type: 'SET_CART_ITEMS', payload: updatedCart });
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item from cart');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const clearCart = async () => {
        if (!user) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await fetch(`${PRODUCT_SERVICE_URL}/cart/${user.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to clear cart');

            dispatch({ type: 'SET_CART_ITEMS', payload: [] });
            toast.success('Cart cleared');
        } catch (error) {
            toast.error('Failed to clear cart');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const checkout = async () => {
        if (!user) {
            toast.error('Please login to checkout');
            router.push('/login');
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            // Create order
            const response = await fetch(`${PRODUCT_SERVICE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: user.id,
                    items: state.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create order');
            }

            // Clear the cart after successful order
            await clearCart();
            toast.success('Order placed successfully!');
            router.push('/orders');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create order';
            toast.error(message);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <CartContext.Provider
            value={{
                state,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                checkout,
                fetchCart,
            }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
