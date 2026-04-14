import { Product, Order } from './types';
import { supabase } from '@/integrations/supabase/client';

// Adapter Pattern: Wraps Supabase client to provide a consistent interface

export class SupabaseProductAdapter {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error) throw error;
    return (data || []).map(this.mapToProduct);
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return null;
    return this.mapToProduct(data);
  }

  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').eq('category', category);
    if (error) throw error;
    return (data || []).map(this.mapToProduct);
  }

  private mapToProduct(row: { id: string; name: string; description: string; price: number; image: string; category: string; stock: number; rating: number; reviews: number }): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      image: row.image,
      category: row.category,
      stock: Number(row.stock),
      rating: Number(row.rating),
      reviews: Number(row.reviews),
    };
  }
}

export class SupabaseOrderAdapter {
  async getAll(userId: string): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(this.mapToOrder);
  }

  async create(order: {
    userId: string;
    items: unknown;
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    status: string;
    discountStrategy: string;
  }): Promise<Order> {
    const { data, error } = await supabase.from('orders').insert({
      user_id: order.userId,
      items: JSON.stringify(order.items),
      subtotal: order.subtotal,
      discount: order.discount,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      discount_strategy: order.discountStrategy,
    }).select().single();
    if (error) throw error;
    return this.mapToOrder(data);
  }

  private mapToOrder(row: { id: string; items: unknown; subtotal: number; discount: number; tax: number; shipping: number; total: number; status: string; discount_strategy: string; created_at: string; user_id: string }): Order {
    return {
      id: row.id,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items as Order['items']),
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      tax: Number(row.tax),
      shipping: Number(row.shipping),
      total: Number(row.total),
      status: row.status as Order['status'],
      discountStrategy: row.discount_strategy || 'None',
      createdAt: new Date(row.created_at),
      userId: row.user_id,
    };
  }
}

export const productAdapter = new SupabaseProductAdapter();
export const orderAdapter = new SupabaseOrderAdapter();
