import { Command, CartItem, Product } from './types';

// Command Pattern: Encapsulate cart operations as commands with undo

export class AddToCartCommand implements Command {
  description: string;

  constructor(
    private cart: CartItem[],
    private setCart: (cart: CartItem[]) => void,
    private product: Product,
    private quantity: number = 1
  ) {
    this.description = `Add ${quantity}x ${product.name} to cart`;
  }

  execute() {
    const existing = this.cart.find(i => i.product.id === this.product.id);
    if (existing) {
      this.setCart(
        this.cart.map(i =>
          i.product.id === this.product.id
            ? { ...i, quantity: i.quantity + this.quantity }
            : i
        )
      );
    } else {
      this.setCart([...this.cart, { product: this.product, quantity: this.quantity }]);
    }
  }

  undo() {
    const existing = this.cart.find(i => i.product.id === this.product.id);
    if (existing) {
      if (existing.quantity <= this.quantity) {
        this.setCart(this.cart.filter(i => i.product.id !== this.product.id));
      } else {
        this.setCart(
          this.cart.map(i =>
            i.product.id === this.product.id
              ? { ...i, quantity: i.quantity - this.quantity }
              : i
          )
        );
      }
    }
  }
}

export class RemoveFromCartCommand implements Command {
  description: string;
  private removedItem: CartItem | null = null;

  constructor(
    private cart: CartItem[],
    private setCart: (cart: CartItem[]) => void,
    private productId: string
  ) {
    const item = cart.find(i => i.product.id === productId);
    this.description = `Remove ${item?.product.name || 'item'} from cart`;
  }

  execute() {
    this.removedItem = this.cart.find(i => i.product.id === this.productId) || null;
    this.setCart(this.cart.filter(i => i.product.id !== this.productId));
  }

  undo() {
    if (this.removedItem) {
      this.setCart([...this.cart, this.removedItem]);
    }
  }
}

export class UpdateQuantityCommand implements Command {
  description: string;
  private previousQuantity: number;

  constructor(
    private cart: CartItem[],
    private setCart: (cart: CartItem[]) => void,
    private productId: string,
    private newQuantity: number
  ) {
    const item = cart.find(i => i.product.id === productId);
    this.previousQuantity = item?.quantity || 0;
    this.description = `Update ${item?.product.name || 'item'} quantity to ${newQuantity}`;
  }

  execute() {
    if (this.newQuantity <= 0) {
      this.setCart(this.cart.filter(i => i.product.id !== this.productId));
    } else {
      this.setCart(
        this.cart.map(i =>
          i.product.id === this.productId ? { ...i, quantity: this.newQuantity } : i
        )
      );
    }
  }

  undo() {
    if (this.previousQuantity <= 0) {
      return;
    }
    const exists = this.cart.find(i => i.product.id === this.productId);
    if (!exists) {
      // Item was removed, can't easily undo without the product reference
      return;
    }
    this.setCart(
      this.cart.map(i =>
        i.product.id === this.productId ? { ...i, quantity: this.previousQuantity } : i
      )
    );
  }
}

// Command history for undo/redo
export class CommandHistory {
  private history: Command[] = [];
  private pointer = -1;

  execute(command: Command) {
    // Remove any future commands after current pointer
    this.history = this.history.slice(0, this.pointer + 1);
    command.execute();
    this.history.push(command);
    this.pointer++;
  }

  undo(): Command | null {
    if (this.pointer < 0) return null;
    const command = this.history[this.pointer];
    command.undo();
    this.pointer--;
    return command;
  }

  redo(): Command | null {
    if (this.pointer >= this.history.length - 1) return null;
    this.pointer++;
    const command = this.history[this.pointer];
    command.execute();
    return command;
  }

  canUndo() { return this.pointer >= 0; }
  canRedo() { return this.pointer < this.history.length - 1; }
  getHistory() { return this.history.map(c => c.description); }
}
