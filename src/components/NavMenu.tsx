import * as React from "react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/data/products";

interface ServiceMenuProps {
  product: Product;
  onNavigateCart: () => void;
}

/**
 * ServiceMenu — direct "Ajouter au panier" button for a product card.
 * Replaces the former hover-dropdown with a single action button.
 */
export function ServiceMenu({ product, onNavigateCart }: ServiceMenuProps): React.ReactElement {
  const { addItem } = useCart();

  function handleAddToCart(): void {
    addItem(product);
    onNavigateCart();
  }

  return (
    <div className="service-menu">
      <button
        aria-label={`Ajouter ${product.name} au panier`}
        className="service-menu__trigger"
        disabled={!product.inStock}
        onClick={handleAddToCart}
        style={{
          background: "var(--color-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "8px 16px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.03em",
          cursor: product.inStock ? "pointer" : "not-allowed",
          opacity: product.inStock ? 1 : 0.5,
          transition: "background 0.15s",
          width: "100%",
        }}
      >
        <span aria-hidden="true">🛍️</span> Ajouter au panier
      </button>
    </div>
  );
}
