'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CUSTOMER_SERVICE_URL } from '@/helpers/constants';
import { toast } from 'react-toastify';
import { Product } from '@/types/product';
import { MdOutlineContentCopy } from 'react-icons/md';

interface OrderItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
    product: Product;
    name: string;
    address: string;
    phone: string;
}

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${CUSTOMER_SERVICE_URL}/orders/${user?.id}`);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            console.log(data, '--data');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Loading orders...</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-600">No orders found.</p>
            ) : (
                <div className="space-y-6">
                    {orders &&
                        orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold flex items-center gap-2">
                                            <span>Order #{order.id}</span>
                                            <span>
                                                <MdOutlineContentCopy
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(order.id);
                                                        toast.success(
                                                            'Order ID copied to clipboard'
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            order.status === 'COMPLETED'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status?.toUpperCase()}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 py-4">
                                    <h3 className="font-medium mb-2">Order Info:</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">Name : {order.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Address : {order.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Phone: {order.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 mt-4 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total:</span>
                                        <span className="font-semibold">${order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
