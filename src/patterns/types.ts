// ===== Core Domain Types =====
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  discountStrategy: string;
  createdAt: Date;
  userId?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

// ===== Strategy Pattern (Discounts) =====
export interface DiscountStrategy {
  name: string;
  description: string;
  calculate(subtotal: number, items: CartItem[]): number;
}

// ===== Command Pattern (Order Actions) =====
export interface Command {
  execute(): void;
  undo(): void;
  description: string;
}

// ===== Observer Pattern (Notifications) =====
export type EventType = 'order_placed' | 'stock_low' | 'payment_success' | 'payment_failed' | 'order_shipped';

export interface Observer {
  id: string;
  update(event: EventType, data: unknown): void;
}

export interface Subject {
  subscribe(observer: Observer): void;
  unsubscribe(observerId: string): void;
  notify(event: EventType, data: unknown): void;
}

// ===== Adapter Pattern (Database) =====
export interface DatabaseAdapter<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
