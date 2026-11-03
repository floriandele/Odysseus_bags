import * as React from "react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/data/products";

interface ServiceMenuProps {
  product: Product;
  onNavigateCart: () => void;
}

/** Items shown in the hover dropdown */
const SERVICE_ITEMS = [
  { icon: "🚚", label: "Livraison offerte dès 80 €" },
  { icon: "↩️", label: "Retours sous 30 jours" },
  { icon: "🔒", label: "Paiement sécurisé" },
  { icon: "🎁", label: "Emballage cadeau disponible" },
];

/**
 * ServiceMenu — "Ajouter au panier" button for a product card with a
 * hover-dropdown showing service benefits (shipping, returns, security).
 *
 * The dropdown is rendered in the DOM at all times so the CSS
 * `.service-menu:hover .service-menu__dropdown` rule can animate it.
 * On touch devices the `@media (hover: none)` fallback renders it inline.
 */
export function ServiceMenu({ product, onNavigateCart }: ServiceMenuProps): React.ReactElement {
  const { addItem } = useCart();

  function handleAddToCart(): void {
    addItem(product);
    onNavigateCart();
  }

  return (
    <div className="service-menu" style={{ width: "100%" }}>
      <button
        aria-label={`Ajouter ${product.name} au panier`}
        aria-haspopup="true"
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

      {/* Dropdown — hidden by default via CSS, revealed on :hover / :focus-within */}
      {product.inStock && (
        <div
          className="service-menu__dropdown"
          role="tooltip"
          aria-label="Informations de service"
        >
          <ul
            style={{
              listStyle: "none",
              padding: "12px 16px",
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {SERVICE_ITEMS.map(({ icon, label }) => (
              <li
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.8rem",
                  color: "#2c1a0e",
                  lineHeight: 1.4,
                }}
              >
                <span aria-hidden="true" style={{ flexShrink: 0 }}>
                  {icon}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
