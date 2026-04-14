import { Product } from '@/patterns/types';
import { getProductImage } from '@/lib/productImages';
import { useCart } from '@/contexts/CartContext';
import { Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group card-hover rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={getProductImage(product.image)}
          alt={product.name}
          loading="lazy"
          width={640}
          height={640}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.stock <= 5 && (
          <span className="absolute top-3 left-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground">
            Only {product.stock} left
          </span>
        )}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{product.category}</p>
            <h3 className="text-base font-semibold text-card-foreground leading-snug mt-0.5">{product.name}</h3>
          </div>
          <span className="text-lg font-bold text-primary whitespace-nowrap">${product.price.toFixed(2)}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="text-sm font-medium text-card-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <Button
          onClick={() => addToCart(product)}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
