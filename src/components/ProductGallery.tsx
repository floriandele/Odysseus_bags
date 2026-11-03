import * as React from "react";
import type { Product } from "@/data/products";
import { ServiceMenu } from "@/components/NavMenu";

interface ProductGalleryProps {
  products: Product[];
  onNavigateCart: () => void;
}

/**
 * ProductGallery — responsive grid of product cards with image, description, price
 * and a service dropdown menu.
 */
export function ProductGallery({ products, onNavigateCart }: ProductGalleryProps): React.ReactElement {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-muted)" }}>
        <p style={{ fontSize: "1.2rem" }}>Aucun produit disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <section aria-label="Galerie de produits">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "28px",
          padding: "8px 0",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onNavigateCart={onNavigateCart} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onNavigateCart,
}: {
  product: Product;
  onNavigateCart: () => void;
}): React.ReactElement {
  const [imgError, setImgError] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  // Validate price defensively — guard against NaN/Infinity coming from external data
  const safePrice =
    Number.isFinite(product.price) && product.price >= 0 ? product.price : 0;

  return (
    <article
      data-testid="product-card"
      aria-label={product.name}
      style={{
        background: "var(--color-card)",
        borderRadius: "var(--radius-lg)",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-md)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        border: "1px solid var(--color-border)",
        opacity: product.inStock ? 1 : 0.75,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product image */}
      <div
        style={{
          height: "240px",
          background: "var(--color-bg-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <ProductPlaceholder name={product.name} category={product.category} />
        )}

        {!product.inStock && (
          <div
            aria-label="Rupture de stock"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(44, 26, 14, 0.75)",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Épuisé
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
        <div>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            {product.category}
          </span>
          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.2rem",
              marginTop: "4px",
              color: "var(--color-text)",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {product.name}
          </h3>
        </div>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            lineHeight: "1.55",
            flex: 1,
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <span style={{ fontStyle: "italic" }}>{product.material}</span>
          {" · "}
          <span>{product.colors.join(", ")}</span>
        </div>

        {/* Price */}
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "var(--color-primary)",
            marginTop: "4px",
          }}
          aria-label={`Prix : ${safePrice} €`}
        >
          {safePrice.toLocaleString("fr-FR")} €
        </div>

        {/* Services dropdown */}
        <div style={{ marginTop: "8px" }}>
          <ServiceMenu product={product} onNavigateCart={onNavigateCart} />
        </div>
      </div>
    </article>
  );
}

/** Fallback placeholder when the product image fails to load */
function ProductPlaceholder({ name, category }: { name: string; category: string }): React.ReactElement {
  const CATEGORY_ICONS: Record<string, string> = {
    tote: "👜",
    clutch: "👝",
    shoulder: "👜",
    crossbody: "🎒",
    travel: "🧳",
  };

  return (
    <div
      aria-label={`Image non disponible pour ${name}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        background: "linear-gradient(135deg, var(--color-bg-soft) 0%, var(--color-primary-soft) 100%)",
        color: "var(--color-text-muted)",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "3.5rem" }} aria-hidden="true">
        {CATEGORY_ICONS[category] ?? "👜"}
      </span>
      <span style={{ fontSize: "0.8rem", fontStyle: "italic" }}>Image à venir</span>
    </div>
  );
}
