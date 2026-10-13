import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Armchair, BadgeCheck, Bot, Check, FastForward, Footprints, Store } from "lucide-react";
import { getVendor } from "../data/catalog";
import { VegMark } from "../components/ui";
import { inr } from "../lib/bill";
import { trackingStages } from "../lib/eta";
import { elapsedMin, getOrder, saveOrder, withSpeed } from "../lib/orders";
import type { PlacedOrder } from "../lib/orders";
import NotFound from "./NotFound";

const DEMO_SPEED = 10;

function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function TrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<PlacedOrder | undefined>(() => getOrder(orderId));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const found = order ? getVendor(order.stadiumId, order.vendorId) : undefined;

  if (!order || !found) return <NotFound />;
  const { stadium, vendor } = found;
  const stages = trackingStages(order.eta, vendor.name, order.stand, order.seat);

  const elapsed = elapsedMin(order, now);
  const total = order.eta.totalMin;
  const remainingSec = (total - elapsed) * 60;
  const delivered = elapsed >= total;
  const currentIndex = stages.reduce((idx, s, i) => (elapsed >= s.atMin ? i : idx), 0);
  const current = stages[currentIndex];
  const progress = Math.min(1, elapsed / total);
  const arrivesAt = new Date(order.clock.anchorReal + ((total - order.clock.anchorSimMin) * 60000) / order.clock.speed);
  const fast = order.clock.speed > 1;

  const toggleSpeed = () => {
    const next = withSpeed(order, fast ? 1 : DEMO_SPEED, Date.now());
    saveOrder(next);
    setOrder(next);
  };

  return (
    <div className="space-y-5">
      <section className="animate-rise relative overflow-hidden rounded-3xl border border-line bg-surface p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-amber/15 blur-3xl" />
        <div className="relative">
            <p className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-[0.15em] text-pitch sm:text-xs sm:tracking-[0.2em]">
            <BadgeCheck className="size-4" /> Payment successful · Order {order.id}
          </p>

          {delivered ? (
            <>
              <h1 className="font-display text-3xl font-semibold tracking-wide sm:text-5xl">Delivered to your seat</h1>
              <p className="mt-2 text-muted">
                {order.stand}, seat {order.seat}. Enjoy the match.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-muted">Arriving at {order.stand}, seat {order.seat} in</p>
              <p className="tabular font-display text-5xl font-semibold tracking-wide text-amber sm:text-7xl">
                {formatClock(remainingSec)}
              </p>
              <p className="mt-1 text-sm text-muted">
                Expected by{" "}
                <span className="font-semibold text-white">
                  {arrivesAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                </span>{" "}
                · {current.title}
              </p>
            </>
          )}

          <div className="mt-6">
            <div className="relative h-2 rounded-full bg-night">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber to-pitch transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-amber text-night shadow-lg shadow-amber/40 transition-[left] duration-1000 ease-linear"
                style={{ left: `${progress * 100}%` }}
              >
                <Footprints className="size-3.5" strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-3 flex justify-between gap-3 text-xs font-semibold text-muted">
              <span className="flex min-w-0 items-center gap-1">
                <Store className="size-3.5 shrink-0" /> <span className="truncate">{vendor.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <Armchair className="size-3.5" /> Seat {order.seat}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold">Live status</h2>
            <span className={`flex items-center gap-1.5 text-xs font-bold ${delivered ? "text-pitch" : "text-amber"}`}>
              <span className={`size-2 rounded-full ${delivered ? "bg-pitch" : "animate-floodlight bg-amber"}`} />
              {delivered ? "Completed" : "Live"}
            </span>
          </div>
          <ol>
            {stages.map((s, i) => {
              const done = i < currentIndex || delivered;
              const active = i === currentIndex && !delivered;
              return (
                <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < stages.length - 1 && (
                    <span className={`absolute left-[13px] top-7 h-[calc(100%-28px)] w-0.5 ${done ? "bg-pitch" : "bg-line"}`} />
                  )}
                  <span
                    className={`relative grid size-7 shrink-0 place-items-center rounded-full border-2 ${done ? "border-pitch bg-pitch text-night" : active ? "border-amber bg-amber/15" : "border-line bg-night"}`}
                  >
                    {done ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : active ? (
                      <span className="animate-floodlight size-2.5 rounded-full bg-amber" />
                    ) : null}
                  </span>
                  <div className={done || active ? "" : "opacity-45"}>
                    <p className={`font-bold ${active ? "text-amber" : ""}`}>{s.title}</p>
                    <p className="text-sm text-muted">{s.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-pitch/30 bg-gradient-to-br from-pitch/10 to-transparent p-5">
            <h2 className="mb-1 flex items-center gap-2 font-bold">
              <Bot className="size-5 text-pitch" /> How AI estimated {total} min
            </h2>
            <p className="mb-4 text-xs text-muted">Confidence: {order.eta.confidence}</p>
            <ul className="space-y-2.5 text-sm">
              {order.eta.factors.map((f) => (
                <li key={f.label} className="flex justify-between gap-3">
                  <span className="text-muted">{f.label}</span>
                  <span className="tabular shrink-0 font-semibold">+{f.minutes} min</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-3 font-bold">Order summary</h2>
            <p className="mb-3 text-sm text-muted">
              {vendor.name} · {stadium.name}
            </p>
            <ul className="space-y-2 text-sm">
              {order.lines.map((l) => (
                <li key={l.itemId} className="flex items-center gap-2">
                  <VegMark veg={l.veg} />
                  <span className="flex-1">
                    {l.qty} × {l.name}
                  </span>
                  <span className="tabular">{inr(l.qty * l.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-dashed border-line pt-3 font-extrabold">
              <span>Paid</span>
              <span className="tabular">{inr(order.bill.total)}</span>
            </div>
            <p className="mt-2 break-all text-xs text-muted">Razorpay payment {order.razorpayPaymentId}</p>
          </section>

          <button
            onClick={toggleSpeed}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition ${fast ? "border-amber bg-amber/15 text-amber" : "border-line text-muted hover:text-white"}`}
          >
            <FastForward className="size-4" />
            {fast ? `Demo speed ${DEMO_SPEED}x on · switch to real time` : `Demo: fast-forward ${DEMO_SPEED}x`}
          </button>

          <Link to="/" className="block text-center text-sm font-semibold text-muted hover:text-white">
            Order something else
          </Link>
        </div>
      </div>
    </div>
  );
}
