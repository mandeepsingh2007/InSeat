import crypto from "node:crypto";
import Razorpay from "razorpay";

export const MIN_AMOUNT_PAISE = 100;

export type ApiResult = { status: number; body: Record<string, unknown> };

type RazorpayError = {
  statusCode?: number;
  error?: { code?: string; description?: string };
};

let client: Razorpay | null = null;

function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && keySecret ? { keyId, keySecret } : null;
}

function getClient(keyId: string, keySecret: string) {
  client ??= new Razorpay({ key_id: keyId, key_secret: keySecret });
  return client;
}

const missingKeys: ApiResult = {
  status: 500,
  body: { error: "Razorpay keys are not configured on the server" },
};

export async function createOrder(input: unknown): Promise<ApiResult> {
  const creds = credentials();
  if (!creds) return missingKeys;

  const { amount, currency = "INR", receipt } = (input ?? {}) as Record<string, unknown>;

  if (typeof amount !== "number" || !Number.isInteger(amount) || amount < MIN_AMOUNT_PAISE) {
    return { status: 400, body: { error: `Amount must be a whole number of at least ${MIN_AMOUNT_PAISE} paise` } };
  }

  try {
    const order = await getClient(creds.keyId, creds.keySecret).orders.create({
      amount,
      currency: typeof currency === "string" ? currency : "INR",
      receipt: typeof receipt === "string" ? receipt.slice(0, 40) : `inseat_${Date.now()}`,
    });
    return { status: 200, body: { order_id: order.id, amount: order.amount, currency: order.currency } };
  } catch (err) {
    const e = err as RazorpayError;
    if (e.statusCode === 401) {
      return { status: 401, body: { error: "Razorpay authentication failed. Check your API keys." } };
    }
    console.error("Razorpay create order failed", e.error ?? err);
    return { status: 500, body: { error: e.error?.description ?? "Could not create the Razorpay order" } };
  }
}

export function verifyPayment(input: unknown): ApiResult {
  const creds = credentials();
  if (!creds) return missingKeys;

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = (input ?? {}) as Record<string, unknown>;

  if (
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string" ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return { status: 400, body: { success: false, error: "Missing payment fields" } };
  }

  const expected = crypto
    .createHmac("sha256", creds.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { status: 400, body: { success: false, error: "Payment signature mismatch" } };
  }

  return { status: 200, body: { success: true, order_id: razorpay_order_id, payment_id: razorpay_payment_id } };
}
