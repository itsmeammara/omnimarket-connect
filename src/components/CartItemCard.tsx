import { useCart } from '@/contexts/CartContext';
import { getProductImage } from '@/lib/productImages';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/patterns/types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemCard({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4 animate-scale-in">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
        <img
          src={getProductImage(item.product.image)}
          alt={item.product.name}
          loading="lazy"
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">{item.product.name}</h3>
            <p className="text-xs text-muted-foreground">{item.product.category}</p>
          </div>
          <span className="text-sm font-bold text-primary">
            ${(item.product.price * item.quantity).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium text-card-foreground">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={() => removeFromCart(item.product.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
