# InSeat

Order food from stalls inside a stadium and get it delivered to your seat. This is a prototype: sports, stadiums, vendors, menus and the delivery ETA are mocked. Payment uses Razorpay Standard Checkout in test mode.

## Flow

1. Pick the sport you are watching
2. Pick a stadium in India that hosts it
3. The app fetches every food stall at that stadium
4. Open a stall and add items to the cart
5. Enter your stand and seat number
6. Pay with Razorpay (test mode)
7. You land on live order tracking with an AI-estimated delivery time

## Run it

```bash
npm install
cp .env.example .env   # then fill in your Razorpay test keys
npm run dev
```

Open http://localhost:5173. `npm run dev` starts the site (Vite on 5173) and the payment API (Express on 4000). Vite forwards `/api` to the API.

## Environment

| Variable | Used by | Notes |
| --- | --- | --- |
| `RAZORPAY_KEY_ID` | API server | Test key, starts with `rzp_test_` |
| `RAZORPAY_KEY_SECRET` | API server only | Never sent to the browser |
| `VITE_RAZORPAY_KEY_ID` | Browser checkout | Same value as `RAZORPAY_KEY_ID` |

`.env` is gitignored.

## Payment endpoints

- `POST /api/create-order` with `{ amount, currency, receipt }`. `amount` is in paise and must be at least 100. Returns `{ order_id, amount, currency }`. Bad amount returns 400, bad Razorpay keys return 401, other Razorpay errors return 500.
- `POST /api/verify-payment` with `razorpay_order_id`, `razorpay_payment_id` and `razorpay_signature`. Checks `HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)`. Missing fields or a wrong signature return 400 and the order is not placed.

## Test a payment

1. Add items, choose a stand and enter a seat such as `C-24`.
2. Click **Pay**. With an `rzp_test_` key, checkout opens with test contact details and the card method preselected, and passes test card number `4100 2800 0000 1007`, expiry `12/26` and CVV `123`.
3. Razorpay documents card prefill for Payment Links, not Standard Checkout. If a card field is empty, copy it from the **Test payment details** box on the cart page. Test UPI: `test@razorpay`. If an OTP page appears, choose success.
4. After verification you are redirected to `/track/<order id>`.

Test details are only sent with `rzp_test_` keys, never with live keys.

Closing the modal keeps your cart and shows "Payment cancelled". A failed attempt shows Razorpay's reason.

On the tracking page, **Demo: fast-forward 10x** speeds up the timeline for demos.

## Deploy on Vercel

Locally, `server/index.ts` runs Express. On Vercel, `api/create-order.ts` and `api/verify-payment.ts` run as serverless functions. Both use the same code in `server/razorpay.ts`, and the URLs stay `/api/create-order` and `/api/verify-payment`. `vercel.json` sends other paths to `index.html`, so refreshing `/cart` or `/track/...` works.

1. Push this folder to GitHub. `.env` is gitignored and must stay out of the repo.
2. In Vercel, choose **Add New → Project**, import the repo, and keep the detected Vite settings.
3. Before the first deploy, open **Environment Variables** and add all three keys from `.env`: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `VITE_RAZORPAY_KEY_ID`.
4. Deploy. `VITE_RAZORPAY_KEY_ID` is built into the site, so redeploy after changing it.

## How the ETA is estimated

`src/lib/eta.ts` adds up kitchen prep (slowest item plus extra for larger orders), the stall's queue, the runner's walk from the stall's stand to yours, and a crowd delay based on stadium size. The tracking page shows each part.
