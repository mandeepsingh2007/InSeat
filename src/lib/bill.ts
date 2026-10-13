export const SEAT_DELIVERY_FEE = 25;
export const PLATFORM_FEE = 5;
export const GST_RATE = 0.05;

export type Bill = {
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  total: number;
};

export function computeBill(itemTotal: number): Bill {
  const gst = Math.round(itemTotal * GST_RATE * 100) / 100;
  const total = Math.round(itemTotal + SEAT_DELIVERY_FEE + PLATFORM_FEE + gst);
  return { itemTotal, deliveryFee: SEAT_DELIVERY_FEE, platformFee: PLATFORM_FEE, gst, total };
}

export const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })}`;
