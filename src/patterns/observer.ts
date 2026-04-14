import { Observer, Subject, EventType } from './types';
import { toast } from 'sonner';

// Observer Pattern: Event notification system

class EventBus implements Subject {
  private observers: Map<string, Observer> = new Map();
  private static instance: EventBus;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  subscribe(observer: Observer) {
    this.observers.set(observer.id, observer);
  }

  unsubscribe(observerId: string) {
    this.observers.delete(observerId);
  }

  notify(event: EventType, data: unknown) {
    this.observers.forEach(observer => observer.update(event, data));
  }
}

// Concrete observers
export class ToastNotifier implements Observer {
  id = 'toast-notifier';
  update(event: EventType, data: unknown) {
    const messages: Record<EventType, string> = {
      order_placed: '🎉 Order placed successfully!',
      stock_low: '⚠️ Stock running low!',
      payment_success: '✅ Payment processed!',
      payment_failed: '❌ Payment failed. Please try again.',
      order_shipped: '📦 Your order has been shipped!',
    };
    const msg = messages[event] || `Event: ${event}`;
    if (event === 'payment_failed') {
      toast.error(msg);
    } else if (event === 'stock_low') {
      toast.warning(msg);
    } else {
      toast.success(msg);
    }
    console.log(`[Observer:Toast] ${event}`, data);
  }
}

export class LogObserver implements Observer {
  id = 'log-observer';
  private logs: Array<{ event: EventType; data: unknown; timestamp: Date }> = [];

  update(event: EventType, data: unknown) {
    this.logs.push({ event, data, timestamp: new Date() });
    console.log(`[Observer:Log] ${event}`, data);
  }

  getLogs() {
    return [...this.logs];
  }
}

export class StockWatcher implements Observer {
  id = 'stock-watcher';
  update(event: EventType, data: unknown) {
    if (event === 'order_placed' && data && typeof data === 'object' && 'items' in data) {
      const items = (data as { items: Array<{ product: { stock: number; name: string }; quantity: number }> }).items;
      items.forEach(item => {
        if (item.product.stock - item.quantity <= 3) {
          eventBus.notify('stock_low', { product: item.product.name, remaining: item.product.stock - item.quantity });
        }
      });
    }
  }
}

export const eventBus = EventBus.getInstance();

// Initialize default observers
const toastNotifier = new ToastNotifier();
const logObserver = new LogObserver();
const stockWatcher = new StockWatcher();

eventBus.subscribe(toastNotifier);
eventBus.subscribe(logObserver);
eventBus.subscribe(stockWatcher);

export { logObserver };
