import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { orderAdapter } from '@/patterns/adapter';
import { Order } from '@/patterns/types';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Clock, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-warning" />,
  confirmed: <CheckCircle className="h-4 w-4 text-success" />,
  shipped: <Truck className="h-4 w-4 text-primary" />,
};

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-success/10 text-success',
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-success/10 text-success',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      orderAdapter.getAll(user.id).then(data => {
        setOrders(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-serif font-semibold text-foreground">Sign in to view orders</h2>
        <Link to="/auth" className="mt-4">
          <Button className="bg-primary text-primary-foreground">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-serif font-bold text-foreground">My Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
              <div className="h-5 bg-secondary rounded w-1/3 mb-3" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-serif font-semibold text-foreground">No orders yet</h2>
          <p className="text-muted-foreground mt-2">Start shopping to see your orders here!</p>
          <Link to="/" className="mt-6">
            <Button className="bg-primary text-primary-foreground">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="rounded-xl border border-border bg-card p-5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {statusIcons[order.status] || <Package className="h-4 w-4 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.createdAt.toLocaleDateString()} · {order.discountStrategy}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[order.status] || 'bg-secondary text-secondary-foreground'}`}>
                    {order.status}
                  </span>
                  <p className="text-sm font-bold text-primary mt-1">${order.total.toFixed(2)}</p>
                </div>
              </div>

              {order.discount > 0 && (
                <p className="text-xs text-success">
                  Saved ${order.discount.toFixed(2)} with {order.discountStrategy}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
