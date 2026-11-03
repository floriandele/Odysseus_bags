/** Odysseus Bags — product catalogue (static seed data) */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // EUR
  /** Relative URL served from /public or an absolute URL */
  image: string;
  category: "tote" | "clutch" | "shoulder" | "crossbody" | "travel";
  material: string;
  colors: string[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "ithaca-tote",
    name: "Ithaca Tote",
    description:
      "Un grand sac cabas en cuir pleine fleur, évoquant le voyage emblématique d'Ulysse. Spacieux, avec compartiment intérieur zippé et poches latérales.",
    price: 480,
    image: "/images/products/ithaca-tote.jpg",
    category: "tote",
    material: "Cuir pleine fleur végétal",
    colors: ["Cognac", "Noir", "Marine"],
    inStock: true,
  },
  {
    id: "circe-clutch",
    name: "Circe Clutch",
    description:
      "Pochette en cuir de veau lisse, idéale pour les soirées. Fermoir magnétique doré et chaîne amovible.",
    price: 220,
    image: "/images/products/circe-clutch.jpg",
    category: "clutch",
    material: "Cuir de veau lisse",
    colors: ["Ivoire", "Bordeaux", "Or"],
    inStock: true,
  },
  {
    id: "penelope-shoulder",
    name: "Penelope Shoulder",
    description:
      "Sac à épaule structuré inspiré de la fidélité de Pénélope. Coutures Sellier, fond rigide et bretelle réglable.",
    price: 395,
    image: "/images/products/penelope-shoulder.jpg",
    category: "shoulder",
    material: "Cuir box calf",
    colors: ["Camel", "Taupe", "Noir"],
    inStock: true,
  },
  {
    id: "calypso-crossbody",
    name: "Calypso Crossbody",
    description:
      "Mini sac bandoulière en cuir grainé, léger et pratique pour une journée en ville. Pochette extérieure zippée.",
    price: 265,
    image: "/images/products/calypso-crossbody.jpg",
    category: "crossbody",
    material: "Cuir grainé",
    colors: ["Terracotta", "Vert sauge", "Noir"],
    inStock: true,
  },
  {
    id: "odyssey-travel",
    name: "Odyssey Travel Bag",
    description:
      "Le sac de voyage signature de la maison, inspiré du périple d'Ulysse. Grande contenance, cuir épais et robuste, fond renforcé.",
    price: 890,
    image: "/images/products/odyssey-travel.jpg",
    category: "travel",
    material: "Cuir crazy horse",
    colors: ["Brun havane", "Noir"],
    inStock: true,
  },
  {
    id: "nausicaa-tote",
    name: "Nausicaa Tote Mini",
    description:
      "Version compacte du célèbre tote, parfaite pour un usage quotidien. Poignées courtes et longue bandoulière incluse.",
    price: 340,
    image: "/images/products/nausicaa-tote.jpg",
    category: "tote",
    material: "Cuir nappa",
    colors: ["Rose poudré", "Blanc cassé", "Camel"],
    inStock: false,
  },
];
