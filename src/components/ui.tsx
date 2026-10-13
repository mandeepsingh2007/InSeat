import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus } from "lucide-react";

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-white"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-amber">{eyebrow}</p>}
      <h1 className="font-display text-2xl font-semibold tracking-wide break-words min-[380px]:text-3xl sm:text-4xl">{title}</h1>
      {children && <div className="mt-2 text-muted">{children}</div>}
    </div>
  );
}

export function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      title={veg ? "Veg" : "Non-veg"}
      className={`inline-grid size-4 shrink-0 place-items-center rounded-[3px] border-2 ${veg ? "border-pitch" : "border-chili"}`}
    >
      <span className={`size-1.5 rounded-full ${veg ? "bg-pitch" : "bg-chili"}`} />
    </span>
  );
}

export function QtyStepper({
  qty,
  onAdd,
  onRemove,
  size = "md",
}: {
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-8" : "h-10";
  if (qty === 0) {
    return (
      <button
        onClick={onAdd}
        className={`${h} min-w-24 rounded-xl border border-amber/60 bg-amber/10 px-5 text-sm font-extrabold tracking-wide text-amber transition hover:bg-amber hover:text-night`}
      >
        ADD
      </button>
    );
  }
  return (
    <div className={`${h} flex min-w-24 items-center justify-between rounded-xl bg-amber text-night`}>
      <button onClick={onRemove} className="grid h-full w-8 place-items-center" aria-label="Remove one">
        <Minus className="size-4" strokeWidth={3} />
      </button>
      <span className="tabular text-sm font-extrabold">{qty}</span>
      <button onClick={onAdd} className="grid h-full w-8 place-items-center" aria-label="Add one">
        <Plus className="size-4" strokeWidth={3} />
      </button>
    </div>
  );
}

export function FetchingScreen({ title, steps, step }: { title: string; steps: string[]; step: number }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-2 text-center">
      <div className="relative mb-8 size-28 sm:size-36">
        <div className="absolute inset-0 rounded-full border border-line" />
        <div className="absolute inset-4 rounded-full border border-line/70" />
        <div className="absolute inset-8 rounded-full border border-line/50" />
        <div className="animate-sweep absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgb(245_158_11/0.45)_60deg,transparent_70deg)]" />
        <div className="animate-floodlight absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_30px_8px_rgb(245_158_11/0.5)]" />
      </div>
      <h2 className="max-w-md font-display text-xl font-semibold tracking-wide sm:text-2xl">{title}</h2>
      <ul className="mt-5 space-y-2 text-sm">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex items-center justify-center gap-2 transition ${i < step ? "text-pitch" : i === step ? "text-white" : "text-muted/50"}`}
          >
            <span
              className={`size-1.5 rounded-full ${i < step ? "bg-pitch" : i === step ? "animate-floodlight bg-amber" : "bg-muted/40"}`}
            />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
