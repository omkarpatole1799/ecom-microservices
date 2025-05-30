import { useCart } from '@/contexts/CartContext';

function OrderSummary() {
    const { state } = useCart();
    const { items } = state;
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    );
}

export default OrderSummary;
