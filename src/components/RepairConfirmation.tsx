import * as React from "react";
import {
  getStatusLabel,
  getNextSteps,
  type RepairRequest,
} from "@/data/repairs";
import { getRepairStores } from "@/data/stores";

interface RepairConfirmationProps {
  request: RepairRequest;
  onNewRepair: () => void;
  onGoHome: () => void;
}

/**
 * RepairConfirmation — final step of the repair flow.
 * Shows the reference number, status, summary, and next steps.
 */
export function RepairConfirmation({
  request,
  onNewRepair,
  onGoHome,
}: RepairConfirmationProps): React.ReactElement {
  const [newRepairHovered, setNewRepairHovered] = React.useState(false);
  const [homeHovered, setHomeHovered] = React.useState(false);

  const nextSteps = getNextSteps(request.handoverMethod);
  const selectedStore = request.storeId
    ? getRepairStores().find((s) => s.id === request.storeId)
    : undefined;

  const createdDate = new Date(request.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* Success card */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: "var(--radius-xl)",
          padding: "40px",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#e8f8ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 24px",
          }}
          aria-hidden="true"
        >
          ✅
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.6rem",
            color: "var(--color-text)",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Demande enregistrée
        </h2>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          Votre demande de réparation a été enregistrée avec succès.
        </p>

        {/* Reference number */}
        <div
          style={{
            background: "var(--color-primary-soft)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            textAlign: "center",
            marginBottom: "28px",
            border: "1px solid var(--color-border)",
          }}
          aria-label="Numéro de référence"
        >
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Numéro de référence
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              letterSpacing: "0.06em",
            }}
            data-testid="repair-reference"
          >
            {request.referenceNumber}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
              marginTop: "8px",
            }}
          >
            Conservez ce numéro — il vous sera demandé pour le suivi.
          </p>
        </div>

        {/* Status badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#e8f8ef",
              color: "var(--color-success)",
              borderRadius: "999px",
              padding: "6px 16px",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
            aria-label={`Statut : ${getStatusLabel(request.status)}`}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-success)",
                display: "inline-block",
              }}
              aria-hidden="true"
            />
            {getStatusLabel(request.status)}
          </span>
        </div>

        {/* Summary details */}
        <div
          style={{
            background: "var(--color-bg-soft)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            marginBottom: "28px",
            fontSize: "0.85rem",
          }}
          aria-label="Résumé de la demande"
        >
          <DetailRow
            label="ID du sac"
            value={request.bagId}
          />
          <DetailRow
            label="Mode de remise"
            value={request.handoverMethod === "store" ? "Dépôt en boutique" : "Retour à distance"}
          />
          {selectedStore && (
            <DetailRow
              label="Boutique sélectionnée"
              value={`${selectedStore.name} — ${selectedStore.address}, ${selectedStore.city}`}
            />
          )}
          <DetailRow
            label="Date de la demande"
            value={createdDate}
          />
          <DetailRow
            label="Délai estimé"
            value={`${request.estimatedDays} jours ouvrés`}
          />
        </div>

        {/* Next steps */}
        <div style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              color: "var(--color-text)",
              marginBottom: "12px",
            }}
          >
            Prochaines étapes
          </h3>
          <ol
            style={{
              paddingLeft: "20px",
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {nextSteps.map((step, i) => (
              <li
                key={i}
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onGoHome}
            onMouseEnter={() => setHomeHovered(true)}
            onMouseLeave={() => setHomeHovered(false)}
            style={{
              flex: 1,
              padding: "12px 20px",
              borderRadius: "var(--radius-md)",
              border: "1.5px solid var(--color-border)",
              background: homeHovered ? "var(--color-bg-soft)" : "transparent",
              color: "var(--color-text)",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.12s",
              minWidth: "120px",
            }}
          >
            Retour à l'accueil
          </button>
          <button
            type="button"
            onClick={onNewRepair}
            onMouseEnter={() => setNewRepairHovered(true)}
            onMouseLeave={() => setNewRepairHovered(false)}
            style={{
              flex: 1,
              padding: "12px 20px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: newRepairHovered
                ? "var(--color-primary-hover)"
                : "var(--color-primary)",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s",
              boxShadow: "var(--shadow-sm)",
              minWidth: "160px",
            }}
          >
            Nouvelle réparation
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        paddingBottom: "8px",
        marginBottom: "8px",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <span style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>{label}</span>
      <span
        style={{
          color: "var(--color-text)",
          fontWeight: 600,
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  );
}
