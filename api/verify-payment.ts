import type { ServerResponse } from "node:http";
import { verifyPayment } from "../server/razorpay.js";
import { rejectNonPost, send } from "./_http.js";
import type { VercelRequest } from "./_http.js";

export default function handler(req: VercelRequest, res: ServerResponse) {
  if (rejectNonPost(req, res)) return;
  send(res, verifyPayment(req.body));
}
