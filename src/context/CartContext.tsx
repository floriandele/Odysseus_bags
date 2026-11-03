import * as React from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * CartState — contract for the shopping cart context.
 *
 * ## Data invariants
 * - `items` contains only structurally valid CartItem objects (validated at parse time).
 * - `quantity` is always a positive integer ≥ 1.
 * - `price` is always a finite non-negative number.
 * - `totalItems` and `totalPrice` are derived from `items` and are never NaN or Infinity.
 *
 * ## localStorage considerations
 * - Reads happen once at mount (lazy initialiser) — guarded with try/catch and schema validation.
 * - Writes happen inside a useEffect; any QuotaExceededError is silently swallowed.
 * - Concurrency: two browser tabs writing simultaneously may overwrite each other (last-write
 *   wins). A `storage` event listener could be added in a future iteration.
 *
 * ## Accessing outside a CartProvider
 * The context value is `null` when consumed outside a `<CartProvider>`. Use the `useCart`
 * hook which throws a descriptive error in that case.
 */
interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = React.createContext<CartState | null>(null);

/**
 * Validates that an unknown value loosely matches the CartItem shape.
 * Used as a defensive guard when parsing stored JSON (handles format migrations
 * and data corruption gracefully by filtering invalid items rather than throwing).
 */
function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;
  const obj = item as Record<string, unknown>;

  // Validate quantity: must be a finite positive integer
  if (
    typeof obj.quantity !== "number" ||
    !Number.isFinite(obj.quantity) ||
    obj.quantity < 1 ||
    !Number.isInteger(obj.quantity)
  ) {
    return false;
  }

  // Validate product shape: requires at least id (non-empty string) and price (finite ≥ 0)
  if (!obj.product || typeof obj.product !== "object") return false;
  const product = obj.product as Record<string, unknown>;
  if (typeof product.id !== "string" || product.id.trim() === "") return false;
  if (
    typeof product.price !== "number" ||
    !Number.isFinite(product.price) ||
    product.price < 0
  ) {
    return false;
  }

  return true;
}

/**
 * Reads and validates cart items from localStorage.
 * Returns an empty array if storage is unavailable, the value is missing,
 * the JSON is malformed, or the top-level shape is not an array.
 * Individual items that fail the schema check are silently dropped.
 */
function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem("odysseus-cart");
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [items, setItems] = React.useState<CartItem[]>(loadCartFromStorage);

  // Persist cart to localStorage whenever items change.
  // Silently ignores QuotaExceededError and SecurityError (e.g. private browsing in Safari).
  React.useEffect(() => {
    try {
      localStorage.setItem("odysseus-cart", JSON.stringify(items));
    } catch {
      /* storage unavailable or quota exceeded — cart still works in-memory */
    }
  }, [items]);

  const addItem = React.useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    // Guard against NaN, Infinity or non-positive values — treat as removal
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: Math.floor(quantity) } : i
        )
      );
    }
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  // Derive totals inside useMemo so the dependency array only needs `items`
  // and the stable callbacks — avoids the previous pattern where totalItems and
  // totalPrice were computed outside the memo (re-creating the context value on
  // every render even when items hadn't changed).
  const value: CartState = React.useMemo(() => {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => {
      const safePrice =
        Number.isFinite(i.product.price) && i.product.price >= 0 ? i.product.price : 0;
      const safeQty = Number.isFinite(i.quantity) && i.quantity > 0 ? i.quantity : 0;
      return sum + safePrice * safeQty;
    }, 0);
    return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice };
  }, [items, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
