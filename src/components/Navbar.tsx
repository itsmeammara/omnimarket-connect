import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Package, Undo2, Redo2, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { itemCount, undo, redo, canUndo, canRedo } = useCart();
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-serif font-bold text-foreground">Omni-Market</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Shop
          </Link>
          {user && (
            <Link
              to="/orders"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/orders' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              My Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Command Pattern: Undo/Redo controls */}
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            className="text-muted-foreground"
            title="Undo last cart action"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            className="text-muted-foreground"
            title="Redo last cart action"
          >
            <Redo2 className="h-4 w-4" />
          </Button>

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-cart-bounce">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm text-muted-foreground">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground" title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
