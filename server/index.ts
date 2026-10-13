import "dotenv/config";
import express from "express";
import { createOrder, verifyPayment } from "./razorpay.js";

const PORT = Number(process.env.PORT ?? 4000);

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.post("/api/create-order", async (req, res) => {
  const result = await createOrder(req.body);
  res.status(result.status).json(result.body);
});

app.post("/api/verify-payment", (req, res) => {
  const result = verifyPayment(req.body);
  res.status(result.status).json(result.body);
});

app.listen(PORT, () => {
  console.log(`InSeat API on http://localhost:${PORT}`);
});
