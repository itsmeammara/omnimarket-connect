import { useCart } from '@/contexts/CartContext';
import CartItemCard from '@/components/CartItemCard';
import OrderSummary from '@/components/OrderSummary';
import DiscountSelector from '@/components/DiscountSelector';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-serif font-bold text-foreground">Shopping Cart</h1>
        <span className="text-sm text-muted-foreground">({items.length} items)</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-serif font-semibold text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">Browse our products and add something you love!</p>
          <Link to="/" className="mt-6">
            <Button className="bg-primary text-primary-foreground">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <CartItemCard key={item.product.id} item={item} />
            ))}
            <DiscountSelector />
          </div>
          <div>
            <OrderSummary />
          </div>
        </div>
      )}
    </div>
  );
}
