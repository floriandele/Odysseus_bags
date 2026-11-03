import * as React from "react";
import { useCart } from "@/hooks/useCart";

interface ShoppingCartProps {
  onContinueShopping: () => void;
}

/**
 * ShoppingCart — displays cart items, allows quantity update and removal,
 * shows empty-cart message, and a checkout placeholder.
 */
export function ShoppingCart({ onContinueShopping }: ShoppingCartProps): React.ReactElement {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
          color: "var(--color-text-muted)",
        }}
        aria-label="Panier vide"
      >
        <div style={{ fontSize: "4rem", marginBottom: "16px" }} aria-hidden="true">
          🛍️
        </div>
        <p style={{ fontSize: "1.2rem", marginBottom: "8px", fontFamily: "var(--font-sans)" }}>
          Votre panier est vide
        </p>
        <p style={{ fontSize: "0.95rem", marginBottom: "28px" }}>
          Découvrez nos sacs à main d'exception et ajoutez-les à votre panier.
        </p>
        <button
          onClick={onContinueShopping}
          style={{
            background: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "12px 28px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Voir les produits
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Cart items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {items.map((item) => (
          <div
            key={item.product.id}
            data-testid="cart-item"
            style={{
              display: "flex",
              gap: "16px",
              background: "var(--color-card)",
              borderRadius: "var(--radius-lg)",
              padding: "16px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
              alignItems: "center",
            }}
            aria-label={`${item.product.name} dans le panier`}
          >
            {/* Product image placeholder */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-soft)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                overflow: "hidden",
              }}
              aria-hidden="true"
            >
              <img
                src={item.product.image}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.parentElement as HTMLElement).textContent = "👜";
                }}
              />
            </div>

            {/* Item info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1rem",
                  color: "var(--color-text)",
                  marginBottom: "4px",
                }}
              >
                {item.product.name}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                {item.product.material}
              </p>
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  fontSize: "1rem",
                  marginTop: "4px",
                }}
              >
                {item.product.price.toLocaleString("fr-FR")} €
              </p>
            </div>

            {/* Quantity controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              aria-label={`Quantité de ${item.product.name}`}
            >
              <button
                aria-label="Diminuer la quantité"
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                style={qtyBtnStyle}
              >
                −
              </button>
              <span
                aria-live="polite"
                style={{
                  minWidth: "28px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {item.quantity}
              </span>
              <button
                aria-label="Augmenter la quantité"
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                style={qtyBtnStyle}
              >
                +
              </button>
            </div>

            {/* Line total */}
            <div
              style={{
                minWidth: "80px",
                textAlign: "right",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "var(--color-text)",
              }}
              aria-label={`Sous-total ${(item.product.price * item.quantity).toLocaleString("fr-FR")} €`}
            >
              {(item.product.price * item.quantity).toLocaleString("fr-FR")} €
            </div>

            {/* Remove button */}
            <button
              aria-label={`Retirer ${item.product.name} du panier`}
              onClick={() => removeItem(item.product.id)}
              style={{
                background: "none",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 10px",
                color: "var(--color-danger)",
                cursor: "pointer",
                fontSize: "0.8rem",
                flexShrink: 0,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#fdecea";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
        aria-label="Résumé de la commande"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          <span>Articles ({totalItems})</span>
          <span>{totalPrice.toLocaleString("fr-FR")} €</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          <span>Livraison</span>
          <span style={{ color: "var(--color-success)", fontWeight: 600 }}>
            Offerte
          </span>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "12px",
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "1.2rem",
            fontFamily: "var(--font-sans)",
            color: "var(--color-text)",
          }}
        >
          <span>Total</span>
          <span aria-label={`Total ${totalPrice.toLocaleString("fr-FR")} €`}>
            {totalPrice.toLocaleString("fr-FR")} €
          </span>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onContinueShopping}
            style={{
              flex: 1,
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "12px 20px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--color-text)",
              minWidth: "140px",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--color-bg-soft)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            Continuer mes achats
          </button>
          <button
            onClick={() => alert("Fonctionnalité de paiement à venir.")}
            style={{
              flex: 2,
              background: "var(--color-primary)",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "12px 24px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              color: "white",
              minWidth: "180px",
              transition: "background 0.15s",
              boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--color-primary-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--color-primary)";
            }}
            aria-label="Procéder au paiement"
          >
            Commander ({totalItems} article{totalItems > 1 ? "s" : ""})
          </button>
        </div>

        {/* Clear cart */}
        <button
          onClick={clearCart}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            fontSize: "0.8rem",
            marginTop: "12px",
            textDecoration: "underline",
            display: "block",
            width: "100%",
            textAlign: "right",
          }}
          aria-label="Vider le panier"
        >
          Vider le panier
        </button>
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-soft)",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 1,
};
