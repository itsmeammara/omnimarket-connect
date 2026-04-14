import { DiscountStrategy, CartItem } from './types';

// Strategy Pattern: Different discount calculation strategies

export class NoDiscount implements DiscountStrategy {
  name = 'None';
  description = 'No discount applied';
  calculate(): number {
    return 0;
  }
}

export class PercentageDiscount implements DiscountStrategy {
  name: string;
  description: string;
  constructor(private percentage: number) {
    this.name = `${percentage}% Off`;
    this.description = `${percentage}% discount on entire order`;
  }
  calculate(subtotal: number): number {
    return subtotal * (this.percentage / 100);
  }
}

export class BulkDiscount implements DiscountStrategy {
  name = 'Bulk (5+ items)';
  description = 'Buy 5+ items and get 15% off';
  calculate(subtotal: number, items: CartItem[]): number {
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    return totalQty >= 5 ? subtotal * 0.15 : 0;
  }
}

export class SeasonalDiscount implements DiscountStrategy {
  name = 'Seasonal 20%';
  description = 'Limited time 20% seasonal sale';
  calculate(subtotal: number): number {
    return subtotal * 0.2;
  }
}

export class FreeShippingThreshold implements DiscountStrategy {
  name = 'Free Shipping (75+)';
  description = 'Free shipping on orders over $75';
  calculate(subtotal: number): number {
    return subtotal >= 75 ? 8.99 : 0; // Removes shipping cost
  }
}

// Available strategies
export const discountStrategies: DiscountStrategy[] = [
  new NoDiscount(),
  new PercentageDiscount(10),
  new BulkDiscount(),
  new SeasonalDiscount(),
  new FreeShippingThreshold(),
];
