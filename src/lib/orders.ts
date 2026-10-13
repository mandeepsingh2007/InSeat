import type { Bill } from "./bill";
import type { Eta } from "./eta";

export type PlacedOrder = {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  stadiumId: string;
  vendorId: string;
  lines: { itemId: string; name: string; qty: number; price: number; veg: boolean }[];
  stand: string;
  seat: string;
  bill: Bill;
  eta: Eta;
  placedAt: number;
  clock: { anchorReal: number; anchorSimMin: number; speed: number };
};

const KEY = "inseat.orders";

function readAll(): Record<string, PlacedOrder> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function saveOrder(order: PlacedOrder) {
  sessionStorage.setItem(KEY, JSON.stringify({ ...readAll(), [order.id]: order }));
}

export function getOrder(id: string | undefined): PlacedOrder | undefined {
  return id ? readAll()[id] : undefined;
}

export function elapsedMin(order: PlacedOrder, now: number) {
  const { anchorReal, anchorSimMin, speed } = order.clock;
  return anchorSimMin + ((now - anchorReal) / 60000) * speed;
}

export function withSpeed(order: PlacedOrder, speed: number, now: number): PlacedOrder {
  return { ...order, clock: { anchorReal: now, anchorSimMin: elapsedMin(order, now), speed } };
}
