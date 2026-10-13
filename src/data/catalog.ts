import type { Stadium } from "./stadiums";
import { getStadium } from "./stadiums";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: boolean;
  prepMin: number;
  bestseller?: boolean;
};

export type VendorKind = "chaat" | "biryani" | "pizza" | "drinks" | "south" | "rolls" | "snacks" | "dessert";

export type Vendor = {
  id: string;
  stadiumId: string;
  name: string;
  kind: VendorKind;
  cuisine: string;
  rating: number;
  ordersAhead: number;
  nearStand: string;
  pureVeg: boolean;
  items: MenuItem[];
};

type Template = {
  kind: VendorKind;
  names: string[];
  cuisine: string;
  pureVeg: boolean;
  items: Omit<MenuItem, "id">[];
};

const templates: Template[] = [
  {
    kind: "chaat",
    names: ["Chaat Corner", "Boundary Chaat", "Gully Chaat House"],
    cuisine: "Street food · Chaat",
    pureVeg: true,
    items: [
      { name: "Pani Puri", description: "6 crisp puris, spicy jaljeera and tangy imli water", price: 80, veg: true, prepMin: 4, bestseller: true },
      { name: "Bhel Puri", description: "Puffed rice, sev, onion, green and sweet chutney", price: 90, veg: true, prepMin: 4 },
      { name: "Samosa Chaat", description: "Crushed samosa, chole, curd and chutneys", price: 120, veg: true, prepMin: 6 },
      { name: "Aloo Tikki", description: "Two crisp potato patties with chole", price: 110, veg: true, prepMin: 7 },
      { name: "Dahi Bhalla", description: "Soft lentil dumplings in sweet curd", price: 110, veg: true, prepMin: 4 },
    ],
  },
  {
    kind: "biryani",
    names: ["Biryani Blues", "Dum Pukht Express", "Royal Biryani Counter"],
    cuisine: "Biryani · Mughlai",
    pureVeg: false,
    items: [
      { name: "Chicken Dum Biryani", description: "Slow-cooked basmati with tender chicken, raita on the side", price: 280, veg: false, prepMin: 9, bestseller: true },
      { name: "Mutton Biryani", description: "Hyderabadi style, rich and spicy", price: 360, veg: false, prepMin: 11 },
      { name: "Veg Dum Biryani", description: "Seasonal vegetables and fragrant spices", price: 220, veg: true, prepMin: 8 },
      { name: "Paneer Tikka Biryani", description: "Smoky paneer tikka layered with rice", price: 260, veg: true, prepMin: 9 },
      { name: "Chicken 65", description: "Crisp spicy fried chicken, 8 pieces", price: 230, veg: false, prepMin: 8 },
    ],
  },
  {
    kind: "pizza",
    names: ["Slice of Six", "Pitch Pizza Co.", "Stadium Slice"],
    cuisine: "Pizza · Fast food",
    pureVeg: false,
    items: [
      { name: "Margherita Slice", description: "Classic tomato, mozzarella and basil", price: 150, veg: true, prepMin: 7 },
      { name: "Farmhouse Pizza (7\")", description: "Capsicum, onion, tomato, mushroom", price: 260, veg: true, prepMin: 10, bestseller: true },
      { name: "Chicken Tikka Pizza (7\")", description: "Tandoori chicken, onion and mint mayo", price: 320, veg: false, prepMin: 11 },
      { name: "Garlic Bread", description: "4 pieces with cheese dip", price: 140, veg: true, prepMin: 6 },
      { name: "Peri Peri Fries", description: "Crisp fries tossed in peri peri", price: 130, veg: true, prepMin: 5 },
    ],
  },
  {
    kind: "drinks",
    names: ["Chai Point", "Thanda Station", "Cooler Bay"],
    cuisine: "Beverages · Chai · Coolers",
    pureVeg: true,
    items: [
      { name: "Masala Chai", description: "Kadak ginger cardamom chai", price: 40, veg: true, prepMin: 3, bestseller: true },
      { name: "Filter Coffee", description: "South Indian decoction, frothy", price: 60, veg: true, prepMin: 3 },
      { name: "Fresh Lime Soda", description: "Sweet, salted or mixed", price: 80, veg: true, prepMin: 2 },
      { name: "Cold Coffee", description: "Thick, chilled, with ice cream", price: 140, veg: true, prepMin: 4 },
      { name: "Mineral Water (1 L)", description: "Sealed bottle", price: 30, veg: true, prepMin: 1 },
      { name: "Soft Drink (500 ml)", description: "Cola, lemon or orange", price: 60, veg: true, prepMin: 1 },
    ],
  },
  {
    kind: "south",
    names: ["Dosa Dugout", "Idli Innings", "Madras Cafe Stall"],
    cuisine: "South Indian",
    pureVeg: true,
    items: [
      { name: "Masala Dosa", description: "Crisp dosa, potato masala, sambar and chutney", price: 140, veg: true, prepMin: 7, bestseller: true },
      { name: "Idli Vada Combo", description: "2 idli, 1 medu vada, sambar", price: 110, veg: true, prepMin: 5 },
      { name: "Mysore Masala Dosa", description: "Spicy red chutney inside", price: 160, veg: true, prepMin: 8 },
      { name: "Uttapam", description: "Onion tomato uttapam", price: 130, veg: true, prepMin: 8 },
    ],
  },
  {
    kind: "rolls",
    names: ["Roll Over", "Kathi Junction", "Rolling Wicket"],
    cuisine: "Rolls · Wraps",
    pureVeg: false,
    items: [
      { name: "Chicken Kathi Roll", description: "Egg-coated paratha with chicken tikka", price: 180, veg: false, prepMin: 6, bestseller: true },
      { name: "Paneer Tikka Roll", description: "Smoky paneer, onion, mint chutney", price: 160, veg: true, prepMin: 6 },
      { name: "Double Egg Roll", description: "Kolkata style, onion and sauce", price: 120, veg: false, prepMin: 5 },
      { name: "Aloo Masala Roll", description: "Spiced potato and pickled onion", price: 110, veg: true, prepMin: 5 },
    ],
  },
  {
    kind: "snacks",
    names: ["Popcorn Pavilion", "Snack Attack", "Munchies Mid-On"],
    cuisine: "Snacks · Quick bites",
    pureVeg: true,
    items: [
      { name: "Butter Popcorn (Large)", description: "Freshly popped, extra butter", price: 150, veg: true, prepMin: 2, bestseller: true },
      { name: "Caramel Popcorn", description: "Sweet and crunchy", price: 170, veg: true, prepMin: 2 },
      { name: "Vada Pav", description: "Mumbai style, dry garlic chutney", price: 60, veg: true, prepMin: 3 },
      { name: "Veg Puff", description: "Flaky pastry, spiced veg filling", price: 50, veg: true, prepMin: 2 },
      { name: "Nachos with Cheese", description: "Tortilla chips, salsa and cheese sauce", price: 160, veg: true, prepMin: 3 },
    ],
  },
  {
    kind: "dessert",
    names: ["Kulfi Cart", "Sweet Spot", "Scoop Stand"],
    cuisine: "Desserts · Ice cream",
    pureVeg: true,
    items: [
      { name: "Malai Kulfi", description: "Matka kulfi with pista", price: 90, veg: true, prepMin: 2, bestseller: true },
      { name: "Chocolate Sundae", description: "Two scoops, fudge and nuts", price: 160, veg: true, prepMin: 3 },
      { name: "Gulab Jamun (2 pcs)", description: "Warm, soaked in syrup", price: 80, veg: true, prepMin: 2 },
      { name: "Mango Lassi", description: "Thick and chilled", price: 110, veg: true, prepMin: 3 },
    ],
  },
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const VENDORS_PER_STADIUM = 6;
const cache = new Map<string, Vendor[]>();

export function vendorsForStadium(stadium: Stadium): Vendor[] {
  const hit = cache.get(stadium.id);
  if (hit) return hit;

  const rand = seeded(hash(stadium.id));
  const pool = [...templates];
  // Every venue keeps a drinks counter so fans can always grab water and chai.
  const drinks = pool.splice(pool.findIndex((t) => t.kind === "drinks"), 1)[0];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = [drinks, ...pool.slice(0, VENDORS_PER_STADIUM - 1)];

  const vendors = picked.map((t, i): Vendor => {
    const id = `${stadium.id}-${t.kind}`;
    const priceBump = 1 + Math.round(rand() * 2) * 0.05;
    return {
      id,
      stadiumId: stadium.id,
      name: t.names[Math.floor(rand() * t.names.length)],
      kind: t.kind,
      cuisine: t.cuisine,
      rating: Math.round((3.9 + rand() * 0.9) * 10) / 10,
      ordersAhead: Math.floor(rand() * 9),
      nearStand: stadium.stands[i % stadium.stands.length],
      pureVeg: t.pureVeg,
      items: t.items.map((item, j) => ({
        ...item,
        id: `${id}-${j}`,
        price: Math.round((item.price * priceBump) / 5) * 5,
      })),
    };
  });

  cache.set(stadium.id, vendors);
  return vendors;
}

export function getVendor(stadiumId: string | undefined, vendorId: string | undefined) {
  const stadium = getStadium(stadiumId);
  if (!stadium) return undefined;
  const vendor = vendorsForStadium(stadium).find((v) => v.id === vendorId);
  return vendor ? { stadium, vendor } : undefined;
}
