import { Link, useParams } from "react-router-dom";
import { ChevronRight, Clock, Leaf, MapPin, Star } from "lucide-react";
import { getStadium } from "../data/stadiums";
import { vendorsForStadium } from "../data/catalog";
import { BackLink, FetchingScreen, PageTitle } from "../components/ui";
import { vendorVisual } from "../components/vendorVisual";
import { useMockFetch } from "../lib/useMockFetch";
import NotFound from "./NotFound";

const steps = [
  "Connecting to stadium food court",
  "Fetching all vendors for this stadium",
  "Checking live kitchen queues",
  "Loading menus",
];

export default function VendorsPage() {
  const { stadiumId } = useParams();
  const stadium = getStadium(stadiumId);
  const { step, loading } = useMockFetch(stadiumId, steps.length, 2200);

  if (!stadium) return <NotFound />;
  if (loading) {
    return <FetchingScreen title={`Fetching all vendors for ${stadium.name}`} steps={steps} step={step} />;
  }

  const vendors = vendorsForStadium(stadium);
  const sportId = stadium.sports[0];

  return (
    <div>
      <BackLink to={`/sport/${sportId}`} label="Stadiums" />
      <PageTitle eyebrow={`${stadium.city}, ${stadium.state}`} title={stadium.name}>
        {vendors.length} stalls are delivering to seats right now
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vendors.map((v, i) => {
          const { icon: Icon, tint } = vendorVisual[v.kind];
          const waitMin = Math.max(...v.items.map((it) => it.prepMin)) + Math.round(v.ordersAhead * 0.8);
          return (
            <Link
              key={v.id}
              to={`/stadium/${stadium.id}/vendor/${v.id}`}
              style={{ animationDelay: `${i * 50}ms` }}
              className="animate-rise group overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-amber/60"
            >
              <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${tint}`}>
                <Icon className="size-14 opacity-90" strokeWidth={1.5} />
                {v.pureVeg && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-night/80 px-2 py-1 text-[11px] font-bold text-pitch">
                    <Leaf className="size-3" /> Pure veg
                  </span>
                )}
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-pitch px-2 py-1 text-xs font-bold text-night">
                  {v.rating} <Star className="size-3 fill-night" />
                </span>
              </div>
              <div className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold">{v.name}</h3>
                  <p className="truncate text-sm text-muted">{v.cuisine}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-amber" /> ~{waitMin} min prep
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-amber" /> Near {v.nearStand}
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted transition group-hover:translate-x-0.5 group-hover:text-amber" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
