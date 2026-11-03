import * as React from "react";
import { getRepairStores, type Store } from "@/data/stores";
import { ReturnLabel } from "@/components/ReturnLabel";
import type { BagRecord } from "@/data/bags";
import type { Customer } from "@/data/customers";

interface RepairHandoverProps {
  bag: BagRecord;
  customer: Customer | undefined;
  problemDescription: string;
  onConfirm: (method: "store" | "remote", storeId?: string) => void;
  onCancel: () => void;
}

/**
 * RepairHandover — step 3 of the repair flow.
 * Offers two handover options: Store drop-off or Remote return.
 * For store drop-off: lists available stores with hours.
 * For remote return: shows a mock return label with shipping instructions.
 */
export function RepairHandover({
  bag,
  customer,
  problemDescription,
  onConfirm,
  onCancel,
}: RepairHandoverProps): React.ReactElement {
  const [activeTab, setActiveTab] = React.useState<"store" | "remote">("store");
  const [selectedStoreId, setSelectedStoreId] = React.useState<string>("");
  const [confirmHovered, setConfirmHovered] = React.useState(false);
  const [cancelHovered, setCancelHovered] = React.useState(false);

  const repairStores = getRepairStores();
  const canConfirmStore = activeTab === "store" && selectedStoreId !== "";
  const canConfirm = activeTab === "remote" || canConfirmStore;

  function handleConfirm() {
    if (activeTab === "store" && selectedStoreId) {
      onConfirm("store", selectedStoreId);
    } else if (activeTab === "remote") {
      onConfirm("remote");
    }
  }

  return (
    <div
      style={{
        maxWidth: "680px",
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
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.6rem",
            color: "var(--color-text)",
            marginBottom: "8px",
          }}
        >
          Mode de remise
        </h2>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
            marginBottom: "28px",
          }}
        >
          Choisissez comment vous souhaitez nous confier votre{" "}
          <strong>{bag.productName}</strong>.
        </p>

        {/* Tab buttons */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "28px",
            background: "var(--color-bg-soft)",
            borderRadius: "var(--radius-md)",
            padding: "4px",
          }}
          role="tablist"
          aria-label="Mode de remise"
        >
          <TabButton
            id="tab-store"
            label="🏪 Dépôt en boutique"
            active={activeTab === "store"}
            onClick={() => setActiveTab("store")}
          />
          <TabButton
            id="tab-remote"
            label="📦 Retour à distance"
            active={activeTab === "remote"}
            onClick={() => setActiveTab("remote")}
          />
        </div>

        {/* Tab panels */}
        {activeTab === "store" && (
          <div
            role="tabpanel"
            aria-labelledby="tab-store"
            style={{ animation: "fadeIn 0.2s ease" }}
          >
            <StoreList
              stores={repairStores}
              selectedStoreId={selectedStoreId}
              onSelectStore={setSelectedStoreId}
            />
            {selectedStoreId && (
              <DropOffInstructions
                store={repairStores.find((s) => s.id === selectedStoreId)!}
              />
            )}
          </div>
        )}

        {activeTab === "remote" && (
          <div
            role="tabpanel"
            aria-labelledby="tab-remote"
            style={{ animation: "fadeIn 0.2s ease" }}
          >
            <ReturnLabel bag={bag} customer={customer} />
            <RemoteInstructions />
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "32px",
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
            ← Retour
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            onMouseEnter={() => setConfirmHovered(true)}
            onMouseLeave={() => setConfirmHovered(false)}
            title={
              !canConfirm
                ? "Merci de compléter tous les champs"
                : undefined
            }
            aria-disabled={!canConfirm}
            style={{
              flex: 2,
              padding: "12px 24px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: !canConfirm
                ? "var(--color-border)"
                : confirmHovered
                ? "var(--color-primary-hover)"
                : "var(--color-primary)",
              color: !canConfirm ? "var(--color-text-muted)" : "white",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: !canConfirm ? "not-allowed" : "pointer",
              transition: "background 0.15s, transform 0.12s",
              transform: canConfirm && confirmHovered ? "translateY(-1px)" : "translateY(0)",
              boxShadow: canConfirm ? "var(--shadow-sm)" : "none",
              minWidth: "180px",
            }}
          >
            Confirmer la demande
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────────────── */

function TabButton({
  id,
  label,
  active,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}): React.ReactElement {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 16px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        background: active ? "var(--color-card)" : "transparent",
        color: active ? "var(--color-primary)" : "var(--color-text-muted)",
        fontWeight: active ? 700 : 500,
        fontSize: "0.9rem",
        cursor: "pointer",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function StoreList({
  stores,
  selectedStoreId,
  onSelectStore,
}: {
  stores: Store[];
  selectedStoreId: string;
  onSelectStore: (id: string) => void;
}): React.ReactElement {
  if (stores.length === 0) {
    return (
      <div
        style={{
          padding: "20px",
          background: "var(--color-bg-soft)",
          borderRadius: "var(--radius-md)",
          color: "var(--color-text-muted)",
          fontSize: "0.9rem",
          textAlign: "center",
        }}
        role="alert"
      >
        Aucun magasin disponible actuellement — veuillez contacter le service client.
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      role="radiogroup"
      aria-label="Choisir un magasin"
    >
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          selected={selectedStoreId === store.id}
          onSelect={() => onSelectStore(store.id)}
        />
      ))}
    </div>
  );
}

function StoreCard({
  store,
  selected,
  onSelect,
}: {
  store: Store;
  selected: boolean;
  onSelect: () => void;
}): React.ReactElement {
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "4px",
        padding: "16px 20px",
        borderRadius: "var(--radius-md)",
        border: selected
          ? "2px solid var(--color-primary)"
          : "1.5px solid var(--color-border)",
        background: selected ? "var(--color-primary-soft)" : "var(--color-bg)",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.15s, background 0.15s",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: selected ? "var(--color-primary)" : "var(--color-text)",
          }}
        >
          {store.name}
        </span>
        {selected && (
          <span
            style={{
              fontSize: "0.75rem",
              background: "var(--color-primary)",
              color: "white",
              borderRadius: "999px",
              padding: "2px 10px",
              fontWeight: 700,
            }}
          >
            Sélectionné
          </span>
        )}
      </div>
      <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
        {store.address}, {store.zipCode} {store.city}
      </span>
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "8px",
          flexWrap: "wrap",
        }}
      >
        {store.hours.map((h, i) => (
          <span
            key={i}
            style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}
          >
            {h.days !== "Fermé" && h.open !== "Fermé" ? (
              <>
                <strong style={{ color: "var(--color-text)" }}>{h.days}</strong>{" "}
                {h.open} – {h.close}
              </>
            ) : (
              <>
                <strong style={{ color: "var(--color-text)" }}>{h.days}</strong>{" "}
                Fermé
              </>
            )}
          </span>
        ))}
      </div>
      <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
        📞 {store.phone}
      </span>
    </button>
  );
}

function DropOffInstructions({ store }: { store: Store }): React.ReactElement {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "16px 20px",
        background: "var(--color-accent-soft)",
        borderRadius: "var(--radius-md)",
        borderLeft: "3px solid var(--color-accent)",
        fontSize: "0.85rem",
        color: "var(--color-text)",
        lineHeight: 1.6,
      }}
      role="note"
      aria-label="Instructions de dépôt en boutique"
    >
      <p style={{ fontWeight: 700, marginBottom: "8px" }}>
        Instructions de dépôt — {store.name}
      </p>
      <ul style={{ paddingLeft: "20px", margin: 0 }}>
        <li>Présentez-vous directement à la boutique avec votre sac.</li>
        <li>Munissez-vous de votre numéro de référence de réparation.</li>
        <li>
          Un de nos artisans effectuera un diagnostic sur place (10-15 min).
        </li>
        <li>Vous recevrez un devis détaillé par e-mail sous 24h.</li>
      </ul>
    </div>
  );
}

function RemoteInstructions(): React.ReactElement {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "16px 20px",
        background: "var(--color-accent-soft)",
        borderRadius: "var(--radius-md)",
        borderLeft: "3px solid var(--color-accent)",
        fontSize: "0.85rem",
        color: "var(--color-text)",
        lineHeight: 1.6,
      }}
      role="note"
      aria-label="Instructions d'expédition"
    >
      <p style={{ fontWeight: 700, marginBottom: "8px" }}>
        Instructions d'expédition
      </p>
      <ul style={{ paddingLeft: "20px", margin: 0 }}>
        <li>Imprimez l'étiquette de retour affichée ci-dessus.</li>
        <li>Emballez soigneusement votre sac dans une boîte rigide.</li>
        <li>Collez l'étiquette sur l'extérieur du colis.</li>
        <li>Déposez le colis dans un bureau de poste ou point relais Colissimo.</li>
        <li>Conservez le récépissé de dépôt jusqu'à la fin de la réparation.</li>
      </ul>
    </div>
  );
}
