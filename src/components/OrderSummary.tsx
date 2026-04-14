import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderAdapter } from '@/patterns/adapter';
import { eventBus } from '@/patterns/observer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderSummary() {
  const { items, subtotal, discount, tax, shipping, total, discountStrategy, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      // Using Adapter Pattern to persist the order
      await orderAdapter.create({
        userId: user.id,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        subtotal,
        discount,
        tax,
        shipping,
        total,
        status: 'confirmed',
        discountStrategy: discountStrategy.name,
      });

      // Observer Pattern: Notify all observers
      eventBus.notify('order_placed', { items, total });
      eventBus.notify('payment_success', { amount: total });

      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Order failed:', err);
      eventBus.notify('payment_failed', { error: err });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 sticky top-20">
      <h3 className="text-lg font-serif font-bold text-card-foreground">Order Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({items.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount ({discountStrategy.name})</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" />
            Shipping
          </span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold text-card-foreground">
        <span>Total</span>
        <span className="text-primary">${total.toFixed(2)}</span>
      </div>

      {shipping > 0 && (
        <p className="text-xs text-muted-foreground">
          💡 Add ${(75 - subtotal).toFixed(2)} more for free shipping
        </p>
      )}

      <Button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
        size="lg"
      >
        <CreditCard className="h-4 w-4" />
        {user ? 'Place Order' : 'Sign In to Checkout'}
      </Button>
    </div>
  );
}
