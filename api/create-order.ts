import type { ServerResponse } from "node:http";
import { createOrder } from "../server/razorpay.js";
import { rejectNonPost, send } from "./_http.js";
import type { VercelRequest } from "./_http.js";

export default async function handler(req: VercelRequest, res: ServerResponse) {
  if (rejectNonPost(req, res)) return;
  send(res, await createOrder(req.body));
}
