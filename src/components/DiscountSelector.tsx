import { useCart } from '@/contexts/CartContext';
import { DiscountStrategy } from '@/patterns/types';
import { Tag } from 'lucide-react';

export default function DiscountSelector() {
  const { discountStrategy, setDiscountStrategy, availableStrategies } = useCart();

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground">Discount Strategy</h3>
        <span className="text-xs text-muted-foreground">(Strategy Pattern)</span>
      </div>
      <div className="space-y-2">
        {availableStrategies.map((strategy: DiscountStrategy) => (
          <label
            key={strategy.name}
            className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
              discountStrategy.name === strategy.name
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <input
              type="radio"
              name="discount"
              checked={discountStrategy.name === strategy.name}
              onChange={() => setDiscountStrategy(strategy)}
              className="accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-card-foreground">{strategy.name}</p>
              <p className="text-xs text-muted-foreground">{strategy.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
