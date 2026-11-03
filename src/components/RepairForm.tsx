import * as React from "react";
import { findBagById, type BagRecord } from "@/data/bags";
import { findCustomerById, type Customer } from "@/data/customers";

interface RepairFormProps {
  onBagFound: (bag: BagRecord, customer: Customer | undefined) => void;
  onCancel: () => void;
}

/**
 * RepairForm — step 1 of the repair flow.
 * Allows the user to enter a bag ID, validates it against the mock registry,
 * and surfaces the found bag + customer info before proceeding.
 */
export function RepairForm({ onBagFound, onCancel }: RepairFormProps): React.ReactElement {
  const [bagId, setBagId] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [btnHovered, setBtnHovered] = React.useState(false);
  const [cancelHovered, setCancelHovered] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = bagId.trim().toUpperCase();
    if (!trimmed) {
      setError("Veuillez saisir un identifiant de sac.");
      return;
    }
    const found = findBagById(trimmed);
    if (!found) {
      setError("Sac non trouvé. Vérifiez l'ID et réessayez.");
      return;
    }
    setError(null);
    const customer = findCustomerById(found.customerId);
    onBagFound(found, customer);
  }

  return (
    <div
      style={{
        maxWidth: "520px",
        margin: "0 auto",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: "var(--radius-xl)",
          padding: "40px",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-primary-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            marginBottom: "24px",
          }}
          aria-hidden="true"
        >
          🔧
        </div>

        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.6rem",
            color: "var(--color-text)",
            marginBottom: "8px",
          }}
        >
          Service Réparation
        </h2>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.95rem",
            marginBottom: "32px",
            lineHeight: 1.5,
          }}
        >
          Saisissez l'identifiant unique de votre sac pour démarrer une demande
          de réparation. Cet ID se trouve à l'intérieur du sac.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="bag-id-input"
            style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--color-text)",
              marginBottom: "8px",
              letterSpacing: "0.03em",
            }}
          >
            Identifiant du sac
          </label>
          <input
            id="bag-id-input"
            type="text"
            value={bagId}
            onChange={(e) => {
              setBagId(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ex: ODB-2023-00142"
            aria-label="Identifiant du sac"
            aria-describedby={error ? "bag-id-error" : undefined}
            aria-invalid={error ? "true" : "false"}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              border: error
                ? "1.5px solid var(--color-danger)"
                : "1.5px solid var(--color-border)",
              fontSize: "1rem",
              fontFamily: "var(--font-ui)",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              if (!error)
                (e.target as HTMLInputElement).style.borderColor =
                  "var(--color-primary)";
            }}
            onBlur={(e) => {
              if (!error)
                (e.target as HTMLInputElement).style.borderColor =
                  "var(--color-border)";
            }}
          />

          {/* Error message */}
          {error && (
            <p
              id="bag-id-error"
              role="alert"
              style={{
                color: "var(--color-danger)",
                fontSize: "0.85rem",
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span aria-hidden="true">⚠️</span> {error}
            </p>
          )}

          {/* Helper text */}
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.8rem",
              marginTop: "8px",
            }}
          >
            IDs de test disponibles : ODB-2023-00142 · ODB-2022-00587 · ODB-2024-00013
          </p>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "28px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--color-border)",
                background: cancelHovered ? "var(--color-bg-soft)" : "transparent",
                color: "var(--color-text-muted)",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.12s",
                minWidth: "120px",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                flex: 2,
                padding: "12px 24px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: btnHovered
                  ? "var(--color-primary-hover)"
                  : "var(--color-primary)",
                color: "white",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.15s, transform 0.12s",
                transform: btnHovered ? "translateY(-1px)" : "translateY(0)",
                boxShadow: "var(--shadow-sm)",
                minWidth: "160px",
              }}
            >
              Rechercher le sac
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
