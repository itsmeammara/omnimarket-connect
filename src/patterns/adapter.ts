import { DatabaseAdapter, Product, Order } from './types';
import { supabase } from '@/integrations/supabase/client';

// Adapter Pattern: Wraps Supabase client to provide a consistent interface

export class SupabaseProductAdapter implements DatabaseAdapter<Product> {
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

  async create(item: Omit<Product, 'id'>): Promise<Product> {
    const { data, error } = await supabase.from('products').insert(item).select().single();
    if (error) throw error;
    return this.mapToProduct(data);
  }

  async update(id: string, item: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase.from('products').update(item).eq('id', id).select().single();
    if (error) throw error;
    return this.mapToProduct(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }

  private mapToProduct(row: Record<string, unknown>): Product {
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      price: Number(row.price),
      image: row.image as string,
      category: row.category as string,
      stock: Number(row.stock),
      rating: Number(row.rating || 4.5),
      reviews: Number(row.reviews || 0),
    };
  }
}

export class SupabaseOrderAdapter implements DatabaseAdapter<Order> {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(this.mapToOrder);
  }

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) return null;
    return this.mapToOrder(data);
  }

  async create(item: Omit<Order, 'id'>): Promise<Order> {
    const dbItem = {
      items: JSON.stringify(item.items),
      subtotal: item.subtotal,
      discount: item.discount,
      tax: item.tax,
      shipping: item.shipping,
      total: item.total,
      status: item.status,
      discount_strategy: item.discountStrategy,
      user_id: item.userId,
    };
    const { data, error } = await supabase.from('orders').insert(dbItem).select().single();
    if (error) throw error;
    return this.mapToOrder(data);
  }

  async update(id: string, item: Partial<Order>): Promise<Order> {
    const dbItem: Record<string, unknown> = {};
    if (item.status) dbItem.status = item.status;
    if (item.items) dbItem.items = JSON.stringify(item.items);
    if (item.total !== undefined) dbItem.total = item.total;
    const { data, error } = await supabase.from('orders').update(dbItem).eq('id', id).select().single();
    if (error) throw error;
    return this.mapToOrder(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
  }

  private mapToOrder(row: Record<string, unknown>): Order {
    return {
      id: row.id as string,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items as Order['items']),
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      tax: Number(row.tax),
      shipping: Number(row.shipping),
      total: Number(row.total),
      status: row.status as Order['status'],
      discountStrategy: (row.discount_strategy as string) || 'None',
      createdAt: new Date(row.created_at as string),
      userId: row.user_id as string | undefined,
    };
  }
}

// Factory for adapters
export const productAdapter = new SupabaseProductAdapter();
export const orderAdapter = new SupabaseOrderAdapter();
