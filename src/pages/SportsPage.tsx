import { Link } from "react-router-dom";
import { ChevronRight, Clock, MapPin, ShieldCheck } from "lucide-react";
import { sports } from "../data/sports";
import { stadiumsForSport } from "../data/stadiums";

export default function SportsPage() {
  return (
    <div>
      <section className="animate-rise mb-8 pt-2">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber">At the stadium today?</p>
        <h1 className="font-display text-[2rem] font-semibold leading-tight tracking-wide min-[380px]:text-4xl sm:text-5xl lg:text-6xl">
          Stay in your seat.
          <br />
          <span className="text-amber">We bring the food.</span>
        </h1>
        <p className="mt-3 max-w-lg text-muted">
          Order from any stall inside the stadium and a runner brings it to your stand and seat. Start with the sport
          you are watching.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-muted">
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5">
            <MapPin className="size-3.5 text-amber" /> Delivered to your seat
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5">
            <Clock className="size-3.5 text-amber" /> Live ETA
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5">
            <ShieldCheck className="size-3.5 text-amber" /> Secure Razorpay payment
          </span>
        </div>
      </section>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">Which sport are you watching?</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {sports.map((sport, i) => {
          const Icon = sport.icon;
          const venues = stadiumsForSport(sport.id).length;
          return (
            <Link
              key={sport.id}
              to={`/sport/${sport.id}`}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-rise group relative overflow-hidden rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-amber/60"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${sport.gradient}`} />
              <div className="relative">
                <span className="mb-4 grid size-10 place-items-center rounded-xl bg-night/60 ring-1 ring-white/10 sm:mb-6 sm:size-11">
                  <Icon className="size-5 text-white" />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-wide sm:text-xl">{sport.name}</h3>
                <p className="mt-0.5 text-xs text-muted">{sport.tagline}</p>
                <p className="mt-3 flex items-center justify-between text-xs font-semibold text-amber">
                  {venues} venues
                  <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
