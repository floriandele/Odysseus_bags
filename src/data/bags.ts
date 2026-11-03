/** Odysseus Bags — bag registry with owner references (static mock data) */

export interface BagRecord {
  /** Unique bag identifier (e.g. serial number printed inside the bag) */
  id: string;
  /** Product reference from the catalogue */
  productId: string;
  productName: string;
  /** Customer ID of the current owner */
  customerId: string;
  purchaseDate: string; // ISO date
  color: string;
  /** Brief repair/service history */
  history: Array<{
    date: string;
    type: string;
    notes: string;
    referenceNumber?: string;
  }>;
}

export const bags: BagRecord[] = [
  {
    id: "ODB-2023-00142",
    productId: "ithaca-tote",
    productName: "Ithaca Tote",
    customerId: "cust-001",
    purchaseDate: "2023-03-15",
    color: "Cognac",
    history: [
      {
        date: "2023-09-10",
        type: "Nettoyage",
        notes: "Nettoyage complet et nourrissage du cuir.",
        referenceNumber: "REPAIR-20230910-38271",
      },
    ],
  },
  {
    id: "ODB-2022-00587",
    productId: "penelope-shoulder",
    productName: "Penelope Shoulder",
    customerId: "cust-001",
    purchaseDate: "2022-11-02",
    color: "Noir",
    history: [],
  },
  {
    id: "ODB-2024-00013",
    productId: "odyssey-travel",
    productName: "Odyssey Travel Bag",
    customerId: "cust-002",
    purchaseDate: "2024-01-20",
    color: "Brun havane",
    history: [],
  },
  {
    id: "ODB-2023-00391",
    productId: "calypso-crossbody",
    productName: "Calypso Crossbody",
    customerId: "cust-003",
    purchaseDate: "2023-07-08",
    color: "Terracotta",
    history: [
      {
        date: "2024-02-14",
        type: "Remplacement fermeture",
        notes: "Remplacement de la fermeture éclair principale.",
        referenceNumber: "REPAIR-20240214-91044",
      },
    ],
  },
  {
    id: "ODB-2021-00209",
    productId: "circe-clutch",
    productName: "Circe Clutch",
    customerId: "cust-002",
    purchaseDate: "2021-06-25",
    color: "Bordeaux",
    history: [],
  },
];

/** Look up a bag by its ID — returns undefined if not found. */
export function findBagById(id: string): BagRecord | undefined {
  return bags.find((b) => b.id === id.trim().toUpperCase());
}
