/** Odysseus Bags — store directory (static mock data) */

export interface StoreHours {
  days: string;
  open: string;
  close: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  hours: StoreHours[];
  repairDropOffAvailable: boolean;
  /** Coordinates for map embed (mock) */
  coordinates: { lat: number; lng: number };
}

export const stores: Store[] = [
  {
    id: "store-paris-marais",
    name: "Odysseus Paris — Le Marais",
    address: "42 rue des Francs-Bourgeois",
    city: "Paris",
    zipCode: "75004",
    country: "France",
    phone: "+33 1 42 72 00 00",
    email: "marais@odysseusbags.fr",
    hours: [
      { days: "Lundi – Vendredi", open: "10:00", close: "19:00" },
      { days: "Samedi", open: "10:00", close: "20:00" },
      { days: "Dimanche", open: "12:00", close: "18:00" },
    ],
    repairDropOffAvailable: true,
    coordinates: { lat: 48.8566, lng: 2.3548 },
  },
  {
    id: "store-paris-saint-germain",
    name: "Odysseus Paris — Saint-Germain",
    address: "15 boulevard Saint-Germain",
    city: "Paris",
    zipCode: "75005",
    country: "France",
    phone: "+33 1 43 25 00 00",
    email: "saint-germain@odysseusbags.fr",
    hours: [
      { days: "Lundi – Vendredi", open: "10:00", close: "19:30" },
      { days: "Samedi", open: "10:00", close: "20:00" },
      { days: "Dimanche", open: "Fermé", close: "Fermé" },
    ],
    repairDropOffAvailable: true,
    coordinates: { lat: 48.8516, lng: 2.3456 },
  },
  {
    id: "store-lyon",
    name: "Odysseus Lyon — Presqu'île",
    address: "8 rue de la République",
    city: "Lyon",
    zipCode: "69002",
    country: "France",
    phone: "+33 4 72 41 00 00",
    email: "lyon@odysseusbags.fr",
    hours: [
      { days: "Mardi – Vendredi", open: "10:30", close: "19:00" },
      { days: "Samedi", open: "10:00", close: "19:30" },
      { days: "Dimanche – Lundi", open: "Fermé", close: "Fermé" },
    ],
    repairDropOffAvailable: true,
    coordinates: { lat: 45.7676, lng: 4.8344 },
  },
];

/** Returns stores available for repair drop-off. */
export function getRepairStores(): Store[] {
  return stores.filter((s) => s.repairDropOffAvailable);
}
