import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Clock, MapPin, Star } from "lucide-react";
import type { MenuItem } from "../data/catalog";
import { getVendor } from "../data/catalog";
import { BackLink, QtyStepper, VegMark } from "../components/ui";
import { vendorVisual } from "../components/vendorVisual";
import { useCart } from "../lib/cart";
import { inr } from "../lib/bill";
import NotFound from "./NotFound";

export default function MenuPage() {
  const { stadiumId, vendorId } = useParams();
  const found = getVendor(stadiumId, vendorId);
  const cart = useCart();
  const [vegOnly, setVegOnly] = useState(false);
  const [pending, setPending] = useState<MenuItem | null>(null);

  if (!found) return <NotFound />;
  const { stadium, vendor } = found;
  const { icon: Icon, tint } = vendorVisual[vendor.kind];
  const items = vegOnly ? vendor.items.filter((i) => i.veg) : vendor.items;
  const cartIsHere = cart.vendor?.id === vendor.id;

  const onAdd = (item: MenuItem) => {
    if (cart.add(vendor, item) === "conflict") setPending(item);
  };

  return (
    <div>
      <BackLink to={`/stadium/${stadium.id}`} label={`${stadium.name} stalls`} />

      <section className="mb-6 overflow-hidden rounded-3xl border border-line bg-surface">
        <div className={`flex items-center gap-4 bg-gradient-to-br p-4 sm:p-6 ${tint}`}>
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-night/60 ring-1 ring-white/10 sm:size-16">
            <Icon className="size-7 sm:size-8" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold tracking-wide text-white sm:text-3xl">{vendor.name}</h1>
            <p className="text-sm text-white/70">{vendor.cuisine}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 py-4 text-sm font-semibold text-muted sm:px-6">
          <span className="flex items-center gap-1.5 text-pitch">
            <Star className="size-4 fill-pitch" /> {vendor.rating}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 text-amber" /> Near {vendor.nearStand}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 text-amber" /> {vendor.ordersAhead} orders in queue
          </span>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Menu · {items.length} items</h2>
        {!vendor.pureVeg && (
          <button
            onClick={() => setVegOnly((v) => !v)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition ${vegOnly ? "border-pitch bg-pitch/15 text-pitch" : "border-line text-muted"}`}
          >
            <VegMark veg /> Veg only
          </button>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {items.map((item, i) => (
          <article
            key={item.id}
            style={{ animationDelay: `${i * 30}ms` }}
            className="animate-rise flex gap-4 rounded-2xl border border-line bg-surface p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <VegMark veg={item.veg} />
                {item.bestseller && (
                  <span className="rounded bg-amber/15 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber">
                    Bestseller
                  </span>
                )}
              </div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="mt-0.5 font-semibold">{inr(item.price)}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-muted">
                <Clock className="size-3.5" /> {item.prepMin} min prep
              </p>
            </div>
            <div className="flex flex-col items-center justify-end">
              <QtyStepper
                qty={cartIsHere ? cart.qtyOf(item.id) : 0}
                onAdd={() => onAdd(item)}
                onRemove={() => cart.remove(item)}
              />
            </div>
          </article>
        ))}
      </div>

      {cart.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 lg:px-8">
          <Link
            to="/cart"
            className="animate-rise mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl bg-amber px-4 py-3.5 text-night shadow-2xl shadow-amber/30 sm:px-5 sm:py-4"
          >
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold uppercase tracking-wider opacity-70">
                {cart.count} item{cart.count > 1 ? "s" : ""} · {cart.vendor?.name}
              </span>
              <span className="text-lg font-extrabold">{inr(cart.itemTotal)}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 font-extrabold">
              View cart <ChevronRight className="size-5" />
            </span>
          </Link>
        </div>
      )}

      {pending && (
        <div className="fixed inset-0 z-40 grid place-items-end bg-black/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:place-items-center">
          <div className="animate-rise w-full max-w-md rounded-3xl border border-line bg-surface p-6">
            <h3 className="font-display text-2xl font-semibold tracking-wide">Start a new cart?</h3>
            <p className="mt-2 text-sm text-muted">
              Your cart has items from {cart.vendor?.name}. One order comes from one stall so a single runner can bring
              it to your seat. Replace it with {pending.name} from {vendor.name}?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => setPending(null)} className="rounded-xl border border-line py-3 font-bold">
                Keep cart
              </button>
              <button
                onClick={() => {
                  cart.replaceWith(vendor, pending);
                  setPending(null);
                }}
                className="rounded-xl bg-amber py-3 font-bold text-night"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
