import * as React from "react";
import { RepairForm } from "@/components/RepairForm";
import { RepairHandover } from "@/components/RepairHandover";
import { RepairConfirmation } from "@/components/RepairConfirmation";
import {
  generateReferenceNumber,
  estimateRepairDays,
  type RepairRequest,
} from "@/data/repairs";
import type { BagRecord } from "@/data/bags";
import type { Customer } from "@/data/customers";
import { findCustomerById } from "@/data/customers";

type FlowStep = "identify" | "describe" | "handover" | "confirmation";

interface RepairFlowProps {
  /** Called when the user cancels — returns to the products section. */
  onCancel: () => void;
}

/**
 * RepairFlow — orchestrates the complete repair request flow:
 *   1. identify  — enter bag ID (RepairForm)
 *   2. describe  — bag info + problem description (inline)
 *   3. handover  — choose store drop-off or remote return (RepairHandover)
 *   4. confirmation — reference number + next steps (RepairConfirmation)
 */
export function RepairFlow({ onCancel }: RepairFlowProps): React.ReactElement {
  const [step, setStep] = React.useState<FlowStep>("identify");
  const [bag, setBag] = React.useState<BagRecord | null>(null);
  const [customer, setCustomer] = React.useState<Customer | undefined>(undefined);
  const [problemDescription, setProblemDescription] = React.useState("");
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [completedRequest, setCompletedRequest] = React.useState<RepairRequest | null>(null);
  const [submitHovered, setSubmitHovered] = React.useState(false);
  const [cancelHovered, setCancelHovered] = React.useState(false);

  /* ── Step 1 callbacks ─────────────────────────────────────────────────────── */

  function handleBagFound(foundBag: BagRecord, foundCustomer: Customer | undefined) {
    setBag(foundBag);
    // Warn if customer is missing but continue
    if (!foundCustomer) {
      const cust = findCustomerById(foundBag.customerId);
      setCustomer(cust);
    } else {
      setCustomer(foundCustomer);
    }
    setProblemDescription("");
    setDescriptionError(false);
    setStep("describe");
  }

  /* ── Step 2 callbacks ─────────────────────────────────────────────────────── */

  function handleDescriptionSubmit() {
    if (!problemDescription.trim()) {
      setDescriptionError(true);
      return;
    }
    setDescriptionError(false);
    setStep("handover");
  }

  /* ── Step 3 callbacks ─────────────────────────────────────────────────────── */

  function handleHandoverConfirm(method: "store" | "remote", storeId?: string) {
    if (!bag) return;
    const request: RepairRequest = {
      referenceNumber: generateReferenceNumber(),
      bagId: bag.id,
      customerId: bag.customerId,
      problemDescription,
      handoverMethod: method,
      storeId,
      createdAt: new Date().toISOString(),
      status: "pending",
      estimatedDays: estimateRepairDays(problemDescription),
    };
    setCompletedRequest(request);
    setStep("confirmation");
  }

  /* ── Step 4 callbacks ─────────────────────────────────────────────────────── */

  function handleNewRepair() {
    setBag(null);
    setCustomer(undefined);
    setProblemDescription("");
    setDescriptionError(false);
    setCompletedRequest(null);
    setStep("identify");
  }

  /* ── Render ───────────────────────────────────────────────────────────────── */

  return (
    <div>
      {/* Progress indicator */}
      {step !== "confirmation" && (
        <StepIndicator currentStep={step} />
      )}

      {/* Step 1 — identify */}
      {step === "identify" && (
        <RepairForm onBagFound={handleBagFound} onCancel={onCancel} />
      )}

      {/* Step 2 — describe problem */}
      {step === "describe" && bag && (
        <DescribeStep
          bag={bag}
          customer={customer}
          problemDescription={problemDescription}
          onDescriptionChange={(val) => {
            setProblemDescription(val);
            if (val.trim()) setDescriptionError(false);
          }}
          descriptionError={descriptionError}
          submitHovered={submitHovered}
          cancelHovered={cancelHovered}
          onSubmitHover={setSubmitHovered}
          onCancelHover={setCancelHovered}
          onSubmit={handleDescriptionSubmit}
          onCancel={() => setStep("identify")}
        />
      )}

      {/* Step 3 — handover */}
      {step === "handover" && bag && (
        <RepairHandover
          bag={bag}
          customer={customer}
          problemDescription={problemDescription}
          onConfirm={handleHandoverConfirm}
          onCancel={() => setStep("describe")}
        />
      )}

      {/* Step 4 — confirmation */}
      {step === "confirmation" && completedRequest && (
        <RepairConfirmation
          request={completedRequest}
          onNewRepair={handleNewRepair}
          onGoHome={onCancel}
        />
      )}
    </div>
  );
}

/* ─── Step indicator ────────────────────────────────────────────────────────── */

const STEPS: Array<{ key: FlowStep; label: string }> = [
  { key: "identify", label: "1. Identification" },
  { key: "describe", label: "2. Description" },
  { key: "handover", label: "3. Remise" },
];

function StepIndicator({ currentStep }: { currentStep: FlowStep }): React.ReactElement {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav
      aria-label="Étapes du flux de réparation"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "0",
        marginBottom: "32px",
        maxWidth: "520px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {STEPS.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        return (
          <div
            key={step.key}
            style={{
              display: "flex",
              alignItems: "center",
              flex: idx < STEPS.length - 1 ? 1 : "none",
            }}
          >
            <div
              aria-current={isActive ? "step" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: isDone
                    ? "var(--color-success)"
                    : isActive
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                  color: isDone || isActive ? "white" : "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  transition: "background 0.2s",
                }}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                  fontWeight: isActive ? 700 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: "2px",
                  background: isDone ? "var(--color-success)" : "var(--color-border)",
                  margin: "0 4px",
                  marginBottom: "20px",
                  transition: "background 0.2s",
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Describe step (inline, no separate file) ───────────────────────────────── */

interface DescribeStepProps {
  bag: BagRecord;
  customer: Customer | undefined;
  problemDescription: string;
  onDescriptionChange: (val: string) => void;
  descriptionError: boolean;
  submitHovered: boolean;
  cancelHovered: boolean;
  onSubmitHover: (v: boolean) => void;
  onCancelHover: (v: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function DescribeStep({
  bag,
  customer,
  problemDescription,
  onDescriptionChange,
  descriptionError,
  submitHovered,
  cancelHovered,
  onSubmitHover,
  onCancelHover,
  onSubmit,
  onCancel,
}: DescribeStepProps): React.ReactElement {
  const isComplete = problemDescription.trim().length > 0;

  return (
    <div
      style={{
        maxWidth: "580px",
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
            marginBottom: "24px",
          }}
        >
          Informations du sac
        </h2>

        {/* Customer info */}
        {customer ? (
          <CustomerCard customer={customer} />
        ) : (
          <div
            role="alert"
            style={{
              padding: "12px 16px",
              background: "#fff8e1",
              borderLeft: "3px solid var(--color-accent)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              color: "#7a6000",
              marginBottom: "20px",
            }}
          >
            ⚠️ Client introuvable dans notre registre (ID : {bag.customerId}). La
            demande peut être poursuivie.
          </div>
        )}

        {/* Bag card */}
        <BagCard bag={bag} />

        {/* Repair history (if any) */}
        {bag.history.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
              }}
            >
              Historique de réparations
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {bag.history.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    background: "var(--color-bg-soft)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "var(--color-text)" }}>
                    {entry.date}
                  </span>{" "}
                  — {entry.type}: {entry.notes}
                  {entry.referenceNumber && (
                    <span
                      style={{
                        display: "block",
                        marginTop: "2px",
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        color: "var(--color-primary)",
                      }}
                    >
                      Réf : {entry.referenceNumber}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problem description */}
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="problem-description"
            style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--color-text)",
              marginBottom: "8px",
              letterSpacing: "0.03em",
            }}
          >
            Description du problème <span aria-hidden="true" style={{ color: "var(--color-danger)" }}>*</span>
          </label>
          <textarea
            id="problem-description"
            value={problemDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Décrivez précisément le problème : usure, déchirure, fermeture défectueuse, anse cassée…"
            rows={4}
            aria-label="Description du problème"
            aria-required="true"
            aria-invalid={descriptionError ? "true" : "false"}
            aria-describedby={descriptionError ? "desc-error" : undefined}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              border: descriptionError
                ? "1.5px solid var(--color-danger)"
                : "1.5px solid var(--color-border)",
              fontSize: "0.9rem",
              fontFamily: "var(--font-ui)",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              outline: "none",
              resize: "vertical",
              lineHeight: 1.5,
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              if (!descriptionError)
                (e.target as HTMLTextAreaElement).style.borderColor =
                  "var(--color-primary)";
            }}
            onBlur={(e) => {
              if (!descriptionError)
                (e.target as HTMLTextAreaElement).style.borderColor =
                  "var(--color-border)";
            }}
          />
          {descriptionError && (
            <p
              id="desc-error"
              role="alert"
              style={{
                color: "var(--color-danger)",
                fontSize: "0.85rem",
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span aria-hidden="true">⚠️</span> Merci de compléter tous les champs
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onCancel}
            onMouseEnter={() => onCancelHover(true)}
            onMouseLeave={() => onCancelHover(false)}
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
            onClick={onSubmit}
            disabled={!isComplete}
            onMouseEnter={() => onSubmitHover(true)}
            onMouseLeave={() => onSubmitHover(false)}
            title={!isComplete ? "Merci de compléter tous les champs" : undefined}
            aria-disabled={!isComplete}
            style={{
              flex: 2,
              padding: "12px 24px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: !isComplete
                ? "var(--color-border)"
                : submitHovered
                ? "var(--color-primary-hover)"
                : "var(--color-primary)",
              color: !isComplete ? "var(--color-text-muted)" : "white",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: !isComplete ? "not-allowed" : "pointer",
              transition: "background 0.15s, transform 0.12s",
              transform: isComplete && submitHovered ? "translateY(-1px)" : "translateY(0)",
              boxShadow: isComplete ? "var(--shadow-sm)" : "none",
              minWidth: "180px",
            }}
          >
            Choisir le mode de remise →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Customer card ──────────────────────────────────────────────────────────── */

function CustomerCard({ customer }: { customer: Customer }): React.ReactElement {
  // Generate initials for the avatar
  const initials = (customer.firstName[0] ?? "") + (customer.lastName[0] ?? "");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        background: "var(--color-bg-soft)",
        borderRadius: "var(--radius-md)",
        marginBottom: "20px",
      }}
      aria-label={`Client : ${customer.fullName}`}
    >
      {/* Avatar */}
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: customer.photoUrl ? "transparent" : "var(--color-primary-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "var(--color-primary)",
          flexShrink: 0,
          border: "2px solid var(--color-border)",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        {customer.photoUrl ? (
          <img
            src={customer.photoUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span>{initials.toUpperCase()}</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--color-text)",
            marginBottom: "2px",
          }}
        >
          {customer.fullName}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          {customer.email}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          {customer.phone}
        </p>
      </div>

      {/* Tier badge */}
      <span
        style={{
          background: "var(--color-accent-soft)",
          color: "var(--color-accent)",
          borderRadius: "999px",
          padding: "3px 12px",
          fontSize: "0.75rem",
          fontWeight: 700,
          flexShrink: 0,
          border: "1px solid var(--color-accent)",
        }}
        aria-label={`Niveau fidélité : ${customer.tier}`}
      >
        {customer.tier}
      </span>
    </div>
  );
}

/* ─── Bag card ───────────────────────────────────────────────────────────────── */

function BagCard({ bag }: { bag: BagRecord }): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        background: "var(--color-bg-soft)",
        borderRadius: "var(--radius-md)",
        marginBottom: "20px",
        border: "1px solid var(--color-border)",
      }}
      aria-label={`Sac : ${bag.productName}`}
    >
      {/* Bag icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-primary-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        👜
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "var(--color-text)",
            marginBottom: "2px",
          }}
        >
          {bag.productName}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          Couleur : {bag.color} · ID : {bag.id}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          Acheté le :{" "}
          {new Date(bag.purchaseDate).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
