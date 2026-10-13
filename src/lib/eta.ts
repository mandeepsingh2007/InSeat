import type { MenuItem, Vendor } from "../data/catalog";
import type { Stadium } from "../data/stadiums";

export type EtaFactor = { label: string; minutes: number };

export type Eta = {
  totalMin: number;
  kitchenMin: number;
  factors: EtaFactor[];
  confidence: "High" | "Medium";
  summary: string;
};

type Line = { item: MenuItem; qty: number };

function standDistance(stands: string[], from: string, to: string) {
  const a = stands.indexOf(from);
  const b = stands.indexOf(to);
  if (a < 0 || b < 0) return 2;
  const d = Math.abs(a - b);
  return Math.min(d, stands.length - d);
}

function crowdDelay(capacity: number) {
  if (capacity >= 50000) return { label: "Full-house crowd in the aisles", minutes: 3 };
  if (capacity >= 20000) return { label: "Busy concourse", minutes: 2 };
  return { label: "Light crowd", minutes: 1 };
}

export function estimateEta(stadium: Stadium, vendor: Vendor, lines: Line[], stand: string): Eta {
  const totalQty = lines.reduce((n, l) => n + l.qty, 0);
  const slowestPrep = Math.max(...lines.map((l) => l.item.prepMin));
  const batchExtra = Math.ceil(Math.max(0, totalQty - 2) / 3);
  const kitchen = slowestPrep + batchExtra;
  const queue = Math.round(vendor.ordersAhead * 0.8);
  const distance = standDistance(stadium.stands, vendor.nearStand, stand);
  const walk = 3 + distance * 2;
  const crowd = crowdDelay(stadium.capacity);

  const factors: EtaFactor[] = [
    { label: `Kitchen prep for ${totalQty} item${totalQty > 1 ? "s" : ""}`, minutes: kitchen },
    { label: `${vendor.ordersAhead} order${vendor.ordersAhead === 1 ? "" : "s"} ahead at the stall`, minutes: queue },
    {
      label: distance === 0 ? `Stall is inside ${stand}` : `Runner walk from ${vendor.nearStand} to ${stand}`,
      minutes: walk,
    },
    crowd,
  ].filter((f) => f.minutes > 0);

  const totalMin = factors.reduce((n, f) => n + f.minutes, 0);

  return {
    totalMin,
    kitchenMin: kitchen + queue,
    factors,
    confidence: vendor.ordersAhead <= 4 && distance <= 1 ? "High" : "Medium",
    summary: factors.map((f) => `${f.label} ${f.minutes} min`).join(" · "),
  };
}

export type StageId = "confirmed" | "preparing" | "picked" | "onTheWay" | "arriving" | "delivered";

export type Stage = { id: StageId; title: string; detail: string; atMin: number };

export function trackingStages(eta: Eta, vendorName: string, stand: string, seat: string): Stage[] {
  const pickedAt = Math.max(1.5, eta.kitchenMin);
  const arrivingAt = Math.max(pickedAt + 1, eta.totalMin - 2);
  return [
    { id: "confirmed", title: "Order confirmed", detail: `${vendorName} accepted your order`, atMin: 0 },
    { id: "preparing", title: "Preparing your food", detail: "The kitchen has started on your order", atMin: 0.75 },
    { id: "picked", title: "Picked up by runner", detail: "Your food is packed and with the seat runner", atMin: pickedAt },
    { id: "onTheWay", title: `Heading to ${stand}`, detail: "Runner is moving through the concourse", atMin: pickedAt + 0.5 },
    { id: "arriving", title: "Arriving at your seat", detail: `Look out for the InSeat runner at seat ${seat}`, atMin: arrivingAt },
    { id: "delivered", title: "Delivered", detail: "Enjoy the match and your food", atMin: eta.totalMin },
  ];
}
