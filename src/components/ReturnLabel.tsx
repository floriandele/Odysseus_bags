import * as React from "react";
import type { BagRecord } from "@/data/bags";
import type { Customer } from "@/data/customers";

interface ReturnLabelProps {
  bag: BagRecord;
  customer: Customer | undefined;
}

/**
 * ReturnLabel — visual mock of a shipping return label.
 * Renders as an SVG/HTML label that mimics a Colissimo return label.
 * Not functional — for display purposes only.
 */
export function ReturnLabel({ bag, customer }: ReturnLabelProps): React.ReactElement {
  const trackingCode = `ODB${Date.now().toString().slice(-8)}FR`;
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      aria-label="Étiquette de retour"
      style={{ marginBottom: "8px" }}
    >
      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--color-text-muted)",
          marginBottom: "12px",
        }}
      >
        Étiquette de retour (aperçu — à imprimer)
      </p>

      {/* Label container */}
      <div
        role="img"
        aria-label="Étiquette d'expédition Colissimo retour"
        style={{
          border: "2px solid var(--color-text)",
          borderRadius: "var(--radius-md)",
          padding: "0",
          background: "white",
          fontFamily: "monospace",
          fontSize: "11px",
          maxWidth: "440px",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Header band */}
        <div
          style={{
            background: "var(--color-primary)",
            color: "white",
            padding: "8px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em" }}>
            ODYSSEUS BAGS — RETOUR SAC
          </span>
          <span style={{ fontSize: "11px", opacity: 0.85 }}>COLISSIMO</span>
        </div>

        <div style={{ padding: "16px" }}>
          {/* From / To */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {/* Expéditeur */}
            <div>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#888",
                  marginBottom: "4px",
                }}
              >
                Expéditeur
              </p>
              <p style={{ fontWeight: 700, fontSize: "12px", marginBottom: "2px" }}>
                {customer?.fullName ?? "Client Odysseus"}
              </p>
              <p style={{ color: "#555" }}>{customer?.email ?? ""}</p>
              <p style={{ color: "#555" }}>{customer?.phone ?? ""}</p>
            </div>

            {/* Destinataire */}
            <div>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#888",
                  marginBottom: "4px",
                }}
              >
                Destinataire
              </p>
              <p style={{ fontWeight: 700, fontSize: "12px", marginBottom: "2px" }}>
                ODYSSEUS BAGS
              </p>
              <p style={{ color: "#555" }}>Atelier Réparations</p>
              <p style={{ color: "#555" }}>12 rue de l'Artisan</p>
              <p style={{ color: "#555" }}>75011 Paris, France</p>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              borderTop: "1px dashed #ccc",
              margin: "0 0 12px",
            }}
          />

          {/* Bag info */}
          <div
            style={{
              marginBottom: "12px",
              padding: "8px",
              background: "#f9f9f9",
              borderRadius: "4px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#888",
                marginBottom: "4px",
              }}
            >
              Contenu du colis
            </p>
            <p style={{ fontWeight: 700 }}>
              {bag.productName} — {bag.color}
            </p>
            <p style={{ color: "#666" }}>ID sac : {bag.id}</p>
          </div>

          {/* Barcode mockup */}
          <div style={{ textAlign: "center", margin: "12px 0" }}>
            <BarcodeStripes trackingCode={trackingCode} />
            <p
              style={{
                marginTop: "6px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontSize: "12px",
              }}
            >
              {trackingCode}
            </p>
          </div>

          {/* Date */}
          <p
            style={{
              textAlign: "right",
              color: "#999",
              fontSize: "9px",
              marginTop: "8px",
            }}
          >
            Généré le {today} — DOCUMENT SIMULÉ
          </p>
        </div>
      </div>

      {/* Print hint */}
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          marginTop: "8px",
          fontStyle: "italic",
        }}
      >
        Cette étiquette est une simulation. Dans un environnement de production,
        un PDF serait généré et envoyé par e-mail.
      </p>
    </div>
  );
}

/** Simple SVG barcode stripe simulation for the mock label. */
function BarcodeStripes({ trackingCode }: { trackingCode: string }): React.ReactElement {
  // Generate deterministic stripe widths based on tracking code chars
  const stripes: number[] = [];
  for (let i = 0; i < 40; i++) {
    const charCode = trackingCode.charCodeAt(i % trackingCode.length);
    stripes.push(charCode % 3 === 0 ? 3 : charCode % 2 === 0 ? 2 : 1);
  }

  return (
    <svg
      width="200"
      height="50"
      viewBox="0 0 200 50"
      aria-hidden="true"
      style={{ display: "block", margin: "0 auto" }}
    >
      {stripes.reduce(
        (acc, width, i) => {
          const x = acc.cursor;
          acc.cursor += width + 1;
          if (i % 2 === 0) {
            acc.elements.push(
              <rect key={i} x={x} y={0} width={width} height={50} fill="#111" />
            );
          }
          return acc;
        },
        { cursor: 0, elements: [] as React.ReactElement[] }
      ).elements}
    </svg>
  );
}
