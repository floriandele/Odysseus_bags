import * as React from "react";
import { products } from "@/data/products";
import { ProductGallery } from "@/components/ProductGallery";
import { OdysseusBg } from "@/components/OdysseusBg";
import { ShoppingCart } from "@/components/ShoppingCart";
import { RepairFlow } from "@/components/RepairFlow";
import { useCart } from "@/hooks/useCart";

/**
 * HomePage — main landing page with hero section, product gallery and cart.
 */
export function HomePage(): React.ReactElement {
  const [section, setSection] = React.useState<"products" | "cart" | "repair">("products");
  const [heroHovered, setHeroHovered] = React.useState(false);
  const { totalItems } = useCart();

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg)" }}>
      {/* Navigation */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: "rgba(255, 251, 247, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--color-border)",
          padding: "0 24px",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
          aria-label="Navigation principale"
        >
          {/* Brand */}
          <button
            onClick={() => setSection("products")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
            aria-label="Accueil Odysseus Bags"
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--color-primary)",
                letterSpacing: "0.04em",
              }}
            >
              ODYSSEUS
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginTop: "-2px",
              }}
            >
              Bags de Luxe
            </span>
          </button>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <NavButton
              active={section === "products"}
              onClick={() => setSection("products")}
            >
              Produits
            </NavButton>
            <NavButton
              active={section === "repair"}
              onClick={() => setSection("repair")}
            >
              🔧 Réparation
            </NavButton>
            <NavButton
              active={section === "cart"}
              onClick={() => setSection("cart")}
            >
              Panier
              {Number.isFinite(totalItems) && totalItems > 0 && (
                <span
                  aria-label={`${totalItems} articles`}
                  style={{
                    marginLeft: "6px",
                    background: "var(--color-primary)",
                    color: "white",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "1px 7px",
                    lineHeight: "1.5",
                    display: "inline-block",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </NavButton>
          </div>
        </nav>
      </header>

      {/* Hero section with Odysseus background */}
      <section
        className="odysseus-bg"
        aria-label="Maroquinerie de luxe — Odysseus Bags"
        style={{
          position: "relative",
          minHeight: "340px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "linear-gradient(135deg, #faf0e6 0%, #f3e5d0 100%)",
        }}
      >
        {/* SVG background illustration */}
        <OdysseusBg />

        {/* Hero text */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "60px 24px",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "12px",
              fontWeight: 600,
            }}
          >
            Maroquinerie Artisanale
          </p>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              color: "var(--color-primary)",
              lineHeight: 1.1,
              marginBottom: "18px",
              textShadow: "0 2px 8px rgba(255,255,255,0.6)",
            }}
          >
            L'Odyssée du Cuir
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "var(--color-text-muted)",
              maxWidth: "540px",
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            Des sacs à main en cuir d'exception, façonnés à la main pour celles
            et ceux qui valorisent l'authenticité et le voyage.
          </p>
          {/* Use state-based hover to avoid direct DOM mutation in event handlers */}
          <button
            onClick={() => setSection("products")}
            onMouseEnter={() => setHeroHovered(true)}
            onMouseLeave={() => setHeroHovered(false)}
            style={{
              background: heroHovered ? "var(--color-primary-hover)" : "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "14px 32px",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "background 0.15s, transform 0.12s",
              boxShadow: "var(--shadow-md)",
              transform: heroHovered ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            Découvrir la Collection
          </button>
        </div>
      </section>

      {/* Main content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {section === "products" && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "2rem",
                  color: "var(--color-text)",
                  marginBottom: "8px",
                }}
              >
                Notre Collection
              </h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1rem" }}>
                {products.length} modèles disponibles — Survolez un produit pour accéder aux services.
              </p>
            </div>
            <ProductGallery
              products={products}
              onNavigateCart={() => setSection("cart")}
            />
          </>
        )}

        {section === "cart" && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <button
                onClick={() => setSection("products")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-primary)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "16px",
                  padding: 0,
                }}
              >
                ← Retour aux produits
              </button>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "2rem",
                  color: "var(--color-text)",
                }}
              >
                Mon Panier
              </h2>
            </div>
            <ShoppingCart onContinueShopping={() => setSection("products")} />
          </>
        )}

        {section === "repair" && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "2rem",
                  color: "var(--color-text)",
                  marginBottom: "8px",
                }}
              >
                Service Réparation
              </h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1rem" }}>
                Confiez votre sac Odysseus à nos artisans pour une réparation experte.
              </p>
            </div>
            <RepairFlow onCancel={() => setSection("products")} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "28px 24px",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.85rem",
          background: "var(--color-bg-soft)",
        }}
      >
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", marginBottom: "6px" }}>
          ODYSSEUS Bags
        </p>
        <p>Maroquinerie artisanale de luxe · Fait main en France</p>
        <p style={{ marginTop: "8px", fontSize: "0.75rem", opacity: 0.7 }}>
          © 2024 Odysseus Bags — Tous droits réservés
        </p>
      </footer>
    </div>
  );
}

function NavButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}): React.ReactElement {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: active
          ? "var(--color-primary-soft)"
          : hovered
          ? "var(--color-bg-soft)"
          : "none",
        border: "none",
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.9rem",
        fontWeight: active ? 700 : 400,
        color: active ? "var(--color-primary)" : "var(--color-text-muted)",
        transition: "all 0.12s",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </button>
  );
}
