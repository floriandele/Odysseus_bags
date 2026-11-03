/** Odysseus Bags — customer directory (static mock data) */

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  /** Full display name */
  fullName: string;
  email: string;
  phone: string;
  /** URL or placeholder for the customer photo */
  photoUrl: string;
  /** Loyalty tier */
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  memberSince: string; // ISO year
}

export const customers: Customer[] = [
  {
    id: "cust-001",
    firstName: "Axel",
    lastName: "Dodysseus",
    fullName: "Axel Dodysseus",
    email: "axel.dodysseus@email.com",
    phone: "+33 6 12 34 56 78",
    photoUrl: "", // will use initials fallback
    tier: "Gold",
    memberSince: "2021",
  },
  {
    id: "cust-002",
    firstName: "Elena",
    lastName: "Karpathios",
    fullName: "Elena Karpathios",
    email: "elena.k@email.com",
    phone: "+33 6 87 65 43 21",
    photoUrl: "",
    tier: "Platinum",
    memberSince: "2020",
  },
  {
    id: "cust-003",
    firstName: "Marc",
    lastName: "Labelle",
    fullName: "Marc Labelle",
    email: "marc.labelle@email.com",
    phone: "+33 6 55 44 33 22",
    photoUrl: "",
    tier: "Silver",
    memberSince: "2023",
  },
];

/** Look up a customer by ID — returns undefined if not found. */
export function findCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}
