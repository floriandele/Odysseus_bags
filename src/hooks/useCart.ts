import * as React from "react";
import { CartContext } from "@/context/CartContext";

/**
 * useCart — consumes the CartContext.
 * Must be used inside <CartProvider>.
 */
export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
