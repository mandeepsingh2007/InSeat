import type { LucideIcon } from "lucide-react";
import { CircleDot, Feather, Footprints, Goal, Swords, Target, Trophy, Users } from "lucide-react";

export type Sport = {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  gradient: string;
};

export const sports: Sport[] = [
  {
    id: "cricket",
    name: "Cricket",
    tagline: "IPL, Tests and ODIs",
    icon: Target,
    gradient: "from-sky-500/30 via-sky-500/10 to-transparent",
  },
  {
    id: "football",
    name: "Football",
    tagline: "ISL and I-League",
    icon: Goal,
    gradient: "from-emerald-500/30 via-emerald-500/10 to-transparent",
  },
  {
    id: "hockey",
    name: "Hockey",
    tagline: "Hockey India League",
    icon: Swords,
    gradient: "from-indigo-500/30 via-indigo-500/10 to-transparent",
  },
  {
    id: "kabaddi",
    name: "Kabaddi",
    tagline: "Pro Kabaddi League",
    icon: Users,
    gradient: "from-orange-500/30 via-orange-500/10 to-transparent",
  },
  {
    id: "badminton",
    name: "Badminton",
    tagline: "Premier Badminton League",
    icon: Feather,
    gradient: "from-fuchsia-500/30 via-fuchsia-500/10 to-transparent",
  },
  {
    id: "tennis",
    name: "Tennis",
    tagline: "ATP and WTA events",
    icon: CircleDot,
    gradient: "from-lime-500/30 via-lime-500/10 to-transparent",
  },
  {
    id: "athletics",
    name: "Athletics",
    tagline: "National and Grand Prix meets",
    icon: Footprints,
    gradient: "from-rose-500/30 via-rose-500/10 to-transparent",
  },
  {
    id: "basketball",
    name: "Basketball",
    tagline: "INBL and national leagues",
    icon: Trophy,
    gradient: "from-amber-500/30 via-amber-500/10 to-transparent",
  },
];

export const getSport = (id: string | undefined) => sports.find((s) => s.id === id);
