import * as React from "react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/data/products";

interface ServiceMenuProps {
  product: Product;
  onNavigateCart: () => void;
}

/**
 * ServiceMenu — dropdown that appears on hover (or focus) over a product card.
 * Provides: Add to cart, Return my bag, Repair my bag.
 *
 * On touch/hover:none devices the menu is rendered inline (CSS media query).
 *
 * ## Memory-leak prevention
 * Toast messages are dismissed via `setTimeout`. Each timeout is tracked with
 * `useRef` so it can be cleared in the cleanup function returned from `useEffect`
 * (or when the component unmounts). This prevents `setState` calls on an
 * unmounted component — a common source of React memory-leak warnings.
 */
export function ServiceMenu({ product, onNavigateCart }: ServiceMenuProps): React.ReactElement {
  const { addItem } = useCart();
  const [open, setOpen] = React.useState(false);
  const [returnMsg, setReturnMsg] = React.useState("");
  const [repairMsg, setRepairMsg] = React.useState("");

  const returnTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const repairTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending timers when the component unmounts to avoid memory leaks
  // and stale setState calls.
  React.useEffect(() => {
    return () => {
      if (returnTimerRef.current !== null) clearTimeout(returnTimerRef.current);
      if (repairTimerRef.current !== null) clearTimeout(repairTimerRef.current);
    };
  }, []);

  function handleAddToCart(): void {
    addItem(product);
    onNavigateCart();
    setOpen(false);
  }

  function handleReturn(): void {
    setReturnMsg(`Retour du sac "${product.name}" initié.`);
    if (returnTimerRef.current !== null) clearTimeout(returnTimerRef.current);
    returnTimerRef.current = setTimeout(() => {
      setReturnMsg("");
      returnTimerRef.current = null;
    }, 3000);
    setOpen(false);
  }

  function handleRepair(): void {
    setRepairMsg(`Demande de réparation pour "${product.name}" enregistrée.`);
    if (repairTimerRef.current !== null) clearTimeout(repairTimerRef.current);
    repairTimerRef.current = setTimeout(() => {
      setRepairMsg("");
      repairTimerRef.current = null;
    }, 3000);
    setOpen(false);
  }

  return (
    <div
      className="service-menu"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Services pour ${product.name}`}
        className={`service-menu__trigger${open ? " service-menu__trigger--active" : ""}`}
        style={{
          background: "var(--color-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "8px 16px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.03em",
          cursor: "pointer",
          transition: "background 0.15s",
          width: "100%",
        }}
      >
        Services ▾
      </button>

      <div
        className={`service-menu__dropdown${open ? " service-menu__dropdown--open" : ""}`}
        role="menu"
        aria-label={`Options de service pour ${product.name}`}
      >
        <ServiceMenuItem
          icon="🛍️"
          label="Ajouter au panier"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        />
        <ServiceMenuItem
          icon="↩️"
          label="Retourner mon sac"
          onClick={handleReturn}
        />
        <ServiceMenuItem
          icon="🔧"
          label="Réparer mon sac"
          onClick={handleRepair}
        />
      </div>

      {returnMsg && (
        <div role="status" aria-live="polite" style={toastStyle}>
          {returnMsg}
        </div>
      )}
      {repairMsg && (
        <div role="status" aria-live="polite" style={toastStyle}>
          {repairMsg}
        </div>
      )}
    </div>
  );
}

function ServiceMenuItem({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}): React.ReactElement {
  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        background: "none",
        border: "none",
        padding: "10px 16px",
        fontSize: "0.9rem",
        color: disabled ? "var(--color-text-muted)" : "var(--color-text)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.12s",
        textAlign: "left",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-soft)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "none";
      }}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}

const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  background: "var(--color-primary)",
  color: "white",
  padding: "12px 20px",
  borderRadius: "var(--radius-md)",
  fontSize: "0.9rem",
  boxShadow: "var(--shadow-lg)",
  zIndex: 100,
  animation: "fadeIn 0.2s ease",
};
