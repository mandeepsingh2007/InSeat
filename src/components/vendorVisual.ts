import type { LucideIcon } from "lucide-react";
import { ChefHat, CupSoda, IceCreamCone, Pizza, Popcorn, Sandwich, Soup, Utensils } from "lucide-react";
import type { VendorKind } from "../data/catalog";

export const vendorVisual: Record<VendorKind, { icon: LucideIcon; tint: string }> = {
  chaat: { icon: Utensils, tint: "from-orange-500/35 to-rose-500/10 text-orange-300" },
  biryani: { icon: ChefHat, tint: "from-amber-500/35 to-red-500/10 text-amber-300" },
  pizza: { icon: Pizza, tint: "from-red-500/35 to-amber-500/10 text-red-300" },
  drinks: { icon: CupSoda, tint: "from-sky-500/35 to-cyan-500/10 text-sky-300" },
  south: { icon: Soup, tint: "from-lime-500/35 to-emerald-500/10 text-lime-300" },
  rolls: { icon: Sandwich, tint: "from-yellow-500/35 to-orange-500/10 text-yellow-300" },
  snacks: { icon: Popcorn, tint: "from-fuchsia-500/35 to-amber-500/10 text-fuchsia-300" },
  dessert: { icon: IceCreamCone, tint: "from-pink-500/35 to-violet-500/10 text-pink-300" },
};
