import type { IncomingMessage, ServerResponse } from "node:http";
import type { ApiResult } from "../server/razorpay.js";

export type VercelRequest = IncomingMessage & { body?: unknown };

export function send(res: ServerResponse, result: ApiResult) {
  res.statusCode = result.status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result.body));
}

export function rejectNonPost(req: VercelRequest, res: ServerResponse) {
  if (req.method === "POST") return false;
  res.setHeader("Allow", "POST");
  send(res, { status: 405, body: { error: "Method not allowed" } });
  return true;
}
