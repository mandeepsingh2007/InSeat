import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Armchair, Brain, Check, Copy, CreditCard, LoaderCircle, ShieldCheck, ShoppingBag } from "lucide-react";
import { BackLink, PageTitle, QtyStepper, VegMark } from "../components/ui";
import { useCart } from "../lib/cart";
import { computeBill, inr } from "../lib/bill";
import { estimateEta } from "../lib/eta";
import { saveOrder } from "../lib/orders";
import { createOrder, isTestMode, openCheckout, TEST_CARD, TEST_UPI, verifyPayment } from "../lib/razorpay";

type Phase = "idle" | "creating" | "checkout" | "verifying";
type Notice = { tone: "error" | "info"; text: string } | null;

const SEAT_PATTERN = /^[A-Za-z0-9-]{1,8}$/;

export default function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [stand, setStand] = useState("");
  const [seat, setSeat] = useState("");
  const [touched, setTouched] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [notice, setNotice] = useState<Notice>(null);

  const { stadium, vendor, lines } = cart;

  if (!stadium || !vendor || lines.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="mb-5 grid size-20 place-items-center rounded-3xl border border-line bg-surface">
          <ShoppingBag className="size-9 text-muted" />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-wide">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-muted">Pick a stadium and a stall, then add what you want delivered to your seat.</p>
        <Link to="/" className="mt-6 rounded-xl bg-amber px-6 py-3 font-bold text-night">
          Browse stalls
        </Link>
      </div>
    );
  }

  const bill = computeBill(cart.itemTotal);
  const seatValue = seat.trim().toUpperCase();
  const standError = touched && !stand ? "Choose your stand" : null;
  const seatError =
    touched && !SEAT_PATTERN.test(seatValue) ? "Enter your seat number as printed on your ticket, for example C-24" : null;
  const eta = stand ? estimateEta(stadium, vendor, lines, stand) : null;
  const busy = phase !== "idle";

  const pay = async () => {
    setTouched(true);
    setNotice(null);
    if (!stand || !SEAT_PATTERN.test(seatValue)) return;

    try {
      setPhase("creating");
      const order = await createOrder(Math.round(bill.total * 100), `inseat_${Date.now()}`);

      setPhase("checkout");
      const outcome = await openCheckout(order, {
        description: `${vendor.name} · ${stand}, seat ${seatValue}`,
        notes: { stadium: stadium.name, vendor: vendor.name, stand, seat: seatValue },
        onAttemptFailed: (message) => setNotice({ tone: "error", text: message }),
      });

      if (outcome.status === "cancelled") {
        setNotice({ tone: "info", text: "Payment cancelled. Your cart is still here when you are ready." });
        return;
      }
      if (outcome.status === "failed") {
        setNotice({ tone: "error", text: outcome.message });
        return;
      }

      setPhase("verifying");
      await verifyPayment(outcome.payment);

      const now = Date.now();
      const id = `IS${now.toString(36).toUpperCase()}`;
      saveOrder({
        id,
        razorpayOrderId: outcome.payment.razorpay_order_id,
        razorpayPaymentId: outcome.payment.razorpay_payment_id,
        stadiumId: stadium.id,
        vendorId: vendor.id,
        lines: lines.map((l) => ({ itemId: l.item.id, name: l.item.name, qty: l.qty, price: l.item.price, veg: l.item.veg })),
        stand,
        seat: seatValue,
        bill,
        eta: estimateEta(stadium, vendor, lines, stand),
        placedAt: now,
        clock: { anchorReal: now, anchorSimMin: 0, speed: 1 },
      });
      navigate(`/track/${id}`, { replace: true });
      cart.clear();
    } catch (err) {
      setNotice({ tone: "error", text: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setPhase("idle");
    }
  };

  const payLabel: Record<Phase, string> = {
    idle: `Pay ${inr(bill.total)}`,
    creating: "Creating secure order…",
    checkout: "Complete payment in Razorpay…",
    verifying: "Verifying payment…",
  };

  const noticeBox = notice && (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${notice.tone === "error" ? "border-chili/40 bg-chili/10 text-red-200" : "border-line bg-surface-2 text-muted"}`}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      {notice.text}
    </div>
  );

  const payButton = (
    <button
      onClick={pay}
      disabled={busy}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber px-4 text-base font-extrabold text-night shadow-xl shadow-amber/25 transition hover:bg-amber-soft disabled:cursor-wait disabled:opacity-80 sm:text-lg"
    >
      {busy && <LoaderCircle className="size-5 shrink-0 animate-spin" />}
      <span className="truncate">{payLabel[phase]}</span>
    </button>
  );

  return (
    <div className={notice ? "pb-24 lg:pb-0" : "pb-4 lg:pb-0"}>
      <BackLink to={`/stadium/${stadium.id}/vendor/${vendor.id}`} label={`Back to ${vendor.name}`} />
      <PageTitle eyebrow={stadium.name} title="Your order" />

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-4 font-bold">{vendor.name}</h2>
            <ul className="divide-y divide-line">
              {lines.map(({ item, qty }) => (
                <li key={item.id} className="flex items-start gap-3 py-3">
                  <span className="mt-1">
                    <VegMark veg={item.veg} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold sm:truncate">{item.name}</p>
                      <p className="text-sm text-muted">{inr(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <QtyStepper size="sm" qty={qty} onAdd={() => cart.add(vendor, item)} onRemove={() => cart.remove(item)} />
                      <p className="tabular min-w-16 text-right font-semibold">{inr(item.price * qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-1 flex items-center gap-2 font-bold">
              <Armchair className="size-5 text-amber" /> Where should we deliver?
            </h2>
            <p className="mb-4 text-sm text-muted">Check your ticket for your stand and seat.</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">Stand</span>
                <select
                  value={stand}
                  onChange={(e) => setStand(e.target.value)}
                  disabled={busy}
                  className={`h-12 w-full rounded-xl border bg-night px-3 text-base outline-none focus:border-amber sm:text-sm ${standError ? "border-chili" : "border-line"}`}
                >
                  <option value="">Select stand</option>
                  {stadium.stands.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {standError && <span className="mt-1 block text-xs text-chili">{standError}</span>}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">Seat number</span>
                <input
                  value={seat}
                  onChange={(e) => setSeat(e.target.value)}
                  disabled={busy}
                  placeholder="e.g. C-24"
                  maxLength={8}
                  className={`h-12 w-full rounded-xl border bg-night px-3 text-base uppercase outline-none sm:text-sm placeholder:normal-case placeholder:text-muted focus:border-amber ${seatError ? "border-chili" : "border-line"}`}
                />
                {seatError && <span className="mt-1 block text-xs text-chili">{seatError}</span>}
              </label>
            </div>

            {eta && (
              <div className="animate-rise mt-4 flex items-start gap-3 rounded-xl border border-pitch/30 bg-pitch/10 p-3 text-sm">
                <Brain className="mt-0.5 size-5 shrink-0 text-pitch" />
                <p>
                  <span className="font-bold text-pitch">AI estimate: about {eta.totalMin} min to {stand}.</span>{" "}
                  <span className="text-muted">{eta.summary}</span>
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-4 font-bold">Bill details</h2>
            <dl className="space-y-2.5 text-sm">
              <Row label="Item total" value={inr(bill.itemTotal)} />
              <Row label="Seat delivery" value={inr(bill.deliveryFee)} />
              <Row label="Platform fee" value={inr(bill.platformFee)} />
              <Row label="GST (5%)" value={inr(bill.gst)} />
              <div className="border-t border-dashed border-line pt-3">
                <Row label="To pay" value={inr(bill.total)} strong />
              </div>
            </dl>
          </section>

          <div className="hidden space-y-4 lg:block">
            {noticeBox}
            {payButton}
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="size-3.5 text-pitch" /> Secured by Razorpay · Test mode
          </p>

          {isTestMode && <TestCredentials />}
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 space-y-3 border-t border-line bg-night/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
        {noticeBox}
        {payButton}
      </div>
    </div>
  );
}

function TestCredentials() {
  return (
    <section className="rounded-2xl border border-dashed border-amber/40 bg-amber/5 p-4 text-sm">
      <h3 className="mb-1 flex items-center gap-2 font-bold text-amber">
        <CreditCard className="size-4" /> Test payment details
      </h3>
      <p className="mb-3 text-xs text-muted">Already filled in checkout. Copy here if a field is empty. No real money is charged.</p>
      <dl className="space-y-2">
        <CopyRow label="Card" value={TEST_CARD.display} copy={TEST_CARD.number} />
        <CopyRow label="Expiry" value={TEST_CARD.expiry} />
        <CopyRow label="CVV" value={TEST_CARD.cvv} />
        <CopyRow label="UPI" value={TEST_UPI} />
      </dl>
    </section>
  );
}

function CopyRow({ label, value, copy }: { label: string; value: string; copy?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(copy ?? value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="w-14 text-xs font-bold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="tabular flex-1 font-mono font-semibold">{value}</dd>
      <button
        type="button"
        onClick={onCopy}
        className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-amber/60 hover:text-white"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="size-4 text-pitch" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "text-base font-extrabold" : "text-muted"}`}>
      <dt>{label}</dt>
      <dd className={`tabular ${strong ? "text-white" : "text-white/90"}`}>{value}</dd>
    </div>
  );
}
