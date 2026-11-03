/** Odysseus Bags — repair reference generation and status utilities */

export type RepairStatus =
  | "pending"
  | "received"
  | "in_progress"
  | "ready"
  | "completed";

export type HandoverMethod = "store" | "remote";

export interface RepairRequest {
  referenceNumber: string;
  bagId: string;
  customerId: string;
  problemDescription: string;
  handoverMethod: HandoverMethod;
  /** Set when method === "store" */
  storeId?: string;
  /** ISO timestamp of creation */
  createdAt: string;
  status: RepairStatus;
  estimatedDays: number;
}

/**
 * Generates a unique repair reference number.
 * Format: REPAIR-YYYYMMDD-XXXXX (5-digit random suffix)
 */
export function generateReferenceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const suffix = String(Math.floor(10000 + Math.random() * 90000));
  return `REPAIR-${dateStr}-${suffix}`;
}

/** Human-readable label for a repair status. */
export function getStatusLabel(status: RepairStatus): string {
  const labels: Record<RepairStatus, string> = {
    pending: "En attente de réception",
    received: "Sac reçu",
    in_progress: "En cours de réparation",
    ready: "Prêt pour restitution",
    completed: "Réparation terminée",
  };
  return labels[status] ?? status;
}

/** Estimated repair duration in business days based on description length heuristic (mock). */
export function estimateRepairDays(description: string): number {
  const len = description.trim().length;
  if (len < 50) return 5;
  if (len < 150) return 10;
  return 15;
}

/** Next steps instructions based on handover method. */
export function getNextSteps(method: HandoverMethod): string[] {
  if (method === "store") {
    return [
      "Apportez votre sac avec ce numéro de référence en boutique.",
      "Nos artisans évalueront le sac à votre arrivée.",
      "Vous recevrez un e-mail de confirmation dès la prise en charge.",
      "Nous vous contacterons dès que la réparation est terminée.",
    ];
  }
  return [
    "Emballez soigneusement votre sac en utilisant l'étiquette de retour ci-jointe.",
    "Déposez le colis dans un bureau de poste ou point relais.",
    "Un e-mail de confirmation vous sera envoyé à la réception du sac.",
    "Nous vous contacterons dès que la réparation est terminée.",
  ];
}
