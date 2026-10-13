import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, MapPin, Search, Users } from "lucide-react";
import { getSport } from "../data/sports";
import { stadiumsForSport } from "../data/stadiums";
import { BackLink, FetchingScreen, PageTitle } from "../components/ui";
import { useMockFetch } from "../lib/useMockFetch";
import NotFound from "./NotFound";

const steps = ["Locating stadiums across India", "Checking which venues host this sport", "Loading venue details"];

export default function StadiumsPage() {
  const { sportId } = useParams();
  const sport = getSport(sportId);
  const { step, loading } = useMockFetch(sportId, steps.length, 1500);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    if (!sport) return [];
    const q = query.trim().toLowerCase();
    return stadiumsForSport(sport.id).filter(
      (s) => !q || `${s.name} ${s.city} ${s.state}`.toLowerCase().includes(q),
    );
  }, [sport, query]);

  if (!sport) return <NotFound />;
  if (loading) return <FetchingScreen title={`Finding ${sport.name.toLowerCase()} stadiums`} steps={steps} step={step} />;

  return (
    <div>
      <BackLink to="/" label="All sports" />
      <PageTitle eyebrow={sport.name} title="Pick your stadium">
        {stadiumsForSport(sport.id).length} venues across India
      </PageTitle>

      <label className="mb-5 flex items-center gap-2 rounded-xl border border-line bg-surface px-4 focus-within:border-amber/60">
        <Search className="size-4 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by stadium or city"
          className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted sm:text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((s, i) => (
          <Link
            key={s.id}
            to={`/stadium/${s.id}`}
            style={{ animationDelay: `${i * 35}ms` }}
            className="animate-rise group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-amber/60"
          >
            <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber/25 to-pitch/10 font-display text-xl font-semibold text-amber ring-1 ring-white/10">
              {s.city.slice(0, 3).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold">{s.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                <MapPin className="size-3.5" /> {s.city}, {s.state}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted">
                <Users className="size-3.5" /> {s.capacity.toLocaleString("en-IN")} seats
              </p>
            </div>
            <ChevronRight className="size-5 text-muted transition group-hover:translate-x-0.5 group-hover:text-amber" />
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
          No stadium matches “{query}”.
        </p>
      )}
    </div>
  );
}
