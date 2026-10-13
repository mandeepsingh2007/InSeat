export type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailure = {
  error: { code?: string; description?: string; reason?: string };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: Record<string, string>;
  notes?: Record<string, string>;
  theme?: { color: string };
  handler: (res: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", cb: (res: RazorpayFailure) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export type CreatedOrder = { order_id: string; amount: number; currency: string };

export const TEST_CARD = { number: "4100280000001007", display: "4100 2800 0000 1007", expiry: "12/26", cvv: "123" };
export const TEST_UPI = "test@razorpay";

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;
export const isTestMode = Boolean(razorpayKey?.startsWith("rzp_test_"));

// Card fields are not in the Standard Checkout docs (they are documented for Payment Links),
// so they may be ignored; method preselection needs contact and email to be set.
const testPrefill: Record<string, string> = {
  name: "InSeat Test Fan",
  email: "fan@inseat.test",
  contact: "+919999999999",
  method: "card",
  "card[name]": "InSeat Test Fan",
  "card[number]": TEST_CARD.number,
  "card[expiry]": TEST_CARD.expiry,
  "card[cvv]": TEST_CARD.cvv,
};

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export const createOrder = (amountPaise: number, receipt: string) =>
  post<CreatedOrder>("/api/create-order", { amount: amountPaise, currency: "INR", receipt });

export const verifyPayment = (payload: RazorpaySuccess) =>
  post<{ success: boolean }>("/api/verify-payment", payload);

export type CheckoutOutcome =
  | { status: "paid"; payment: RazorpaySuccess }
  | { status: "cancelled" }
  | { status: "failed"; message: string };

export function openCheckout(
  order: CreatedOrder,
  details: { description: string; notes: Record<string, string>; onAttemptFailed?: (message: string) => void },
): Promise<CheckoutOutcome> {
  const key = razorpayKey;
  if (!key) return Promise.resolve({ status: "failed", message: "VITE_RAZORPAY_KEY_ID is missing in .env" });
  if (!window.Razorpay) {
    return Promise.resolve({ status: "failed", message: "Razorpay Checkout did not load. Check your internet connection." });
  }

  return new Promise((resolve) => {
    let settled = false;
    let lastFailure: string | null = null;
    const settle = (outcome: CheckoutOutcome) => {
      if (settled) return;
      settled = true;
      resolve(outcome);
    };

    const rzp = new window.Razorpay!({
      key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.order_id,
      name: "InSeat",
      description: details.description,
      notes: details.notes,
      prefill: isTestMode ? testPrefill : undefined,
      theme: { color: "#f59e0b" },
      handler: (payment) => settle({ status: "paid", payment }),
      modal: {
        ondismiss: () =>
          settle(lastFailure ? { status: "failed", message: lastFailure } : { status: "cancelled" }),
      },
    });

    // Checkout keeps the modal open after a failed attempt so the user can retry,
    // so a failure only becomes final when the modal is dismissed.
    rzp.on("payment.failed", (res) => {
      lastFailure = res.error.description ?? "Payment failed. Please try again.";
      details.onAttemptFailed?.(lastFailure);
    });

    rzp.open();
  });
}
