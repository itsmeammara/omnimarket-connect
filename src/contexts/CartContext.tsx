import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product, DiscountStrategy } from '@/patterns/types';
import { AddToCartCommand, RemoveFromCartCommand, UpdateQuantityCommand, CommandHistory } from '@/patterns/command';
import { discountStrategies, NoDiscount } from '@/patterns/strategy';
import { eventBus } from '@/patterns/observer';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  discountStrategy: DiscountStrategy;
  setDiscountStrategy: (strategy: DiscountStrategy) => void;
  availableStrategies: DiscountStrategy[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const commandHistory = new CommandHistory();

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountStrategy, setDiscountStrategy] = useState<DiscountStrategy>(new NoDiscount());

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const cmd = new AddToCartCommand(items, setItems, product, quantity);
    commandHistory.execute(cmd);
    toast.success(`Added ${product.name} to cart`);
  }, [items]);

  const removeFromCart = useCallback((productId: string) => {
    const cmd = new RemoveFromCartCommand(items, setItems, productId);
    commandHistory.execute(cmd);
  }, [items]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const cmd = new UpdateQuantityCommand(items, setItems, productId, quantity);
    commandHistory.execute(cmd);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const undo = useCallback(() => {
    const cmd = commandHistory.undo();
    if (cmd) toast.info(`Undone: ${cmd.description}`);
  }, []);

  const redo = useCallback(() => {
    const cmd = commandHistory.redo();
    if (cmd) toast.info(`Redone: ${cmd.description}`);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = discountStrategy.calculate(subtotal, items);
  const shipping = subtotal >= 75 ? 0 : 8.99;
  const adjustedSubtotal = subtotal - discount;
  const tax = adjustedSubtotal * 0.08;
  const total = adjustedSubtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        undo,
        redo,
        canUndo: commandHistory.canUndo(),
        canRedo: commandHistory.canRedo(),
        subtotal,
        discount,
        tax,
        shipping,
        total,
        itemCount,
        discountStrategy,
        setDiscountStrategy,
        availableStrategies: discountStrategies,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
