import { createHash } from "node:crypto";
import { deliverInquiry, DeliveryError, type DeliveryReceipt } from "./contact-delivery.ts";
import { validateInquiry, type Inquiry } from "./contact-validation.ts";
import { RateLimiter } from "./rate-limit.ts";

const MAX_BODY_BYTES = 12 * 1024;
type HandlerOptions = {
  deliver?: (inquiry: Inquiry) => Promise<DeliveryReceipt>;
  limiter?: RateLimiter;
  siteUrl?: string;
};

class BodyTooLarge extends Error {}

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new BodyTooLarge();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Empty body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new BodyTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
}

export function createContactHandler({ deliver = deliverInquiry, limiter = new RateLimiter(), siteUrl }: HandlerOptions = {}) {
  return async function handleContactRequest(request: Request): Promise<Response> {
    if (request.method !== "POST") return json({ message: "Táto metóda nie je podporovaná." }, 405, { Allow: "POST" });

    let expectedOrigin: string;
    try {
      expectedOrigin = new URL(siteUrl || request.url).origin;
    } catch {
      return json({ message: "Formulár momentálne nie je dostupný." }, 503);
    }
    const origin = request.headers.get("origin");
    if ((origin && origin !== expectedOrigin) || (!origin && request.headers.get("sec-fetch-site") === "cross-site")) {
      return json({ message: "Odoslanie z tejto stránky nie je povolené." }, 403);
    }
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return json({ message: "Neplatný formát požiadavky." }, 415);
    }

    // Only trust forwarding headers when the hosting platform overwrites them.
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
    const key = createHash("sha256").update(clientIp).digest("hex");
    const rate = limiter.consume(key);
    if (!rate.allowed) return json({ message: "Odoslali ste viacero správ. Skúste to, prosím, o chvíľu." }, 429, { "Retry-After": String(rate.retryAfter) });

    let input: unknown;
    try {
      input = await readBody(request);
    } catch (error) {
      return error instanceof BodyTooLarge
        ? json({ message: "Správa je príliš veľká. Skráťte ju, prosím." }, 413)
        : json({ message: "Správu sa nepodarilo prečítať. Obnovte stránku a skúste znova." }, 400);
    }

    if (input && typeof input === "object" && "website" in input && input.website) {
      return json({ message: "Formulár sa nepodarilo overiť. Obnovte stránku a skúste znova." }, 400);
    }
    const result = validateInquiry(input);
    if (!result.success) return json({ message: "Skontrolujte označené polia formulára.", errors: result.errors }, 422);

    try {
      const receipt = await deliver(result.data);
      return json({
        ...receipt,
        message: receipt.delivery === "local"
          ? "Ukážkový režim: správa bola uložená lokálne. E-mail nebol odoslaný."
          : "Ďakujeme. Vaša správa bola prijatá na odoslanie. Ozveme sa na uvedený e-mail.",
      }, 201);
    } catch (error) {
      return json({
        message: error instanceof DeliveryError && error.kind === "configuration"
          ? "Doručovanie správ zatiaľ nie je nastavené. Správa nebola odoslaná. Skúste to neskôr."
          : "Odoslanie sa nepodarilo potvrdiť. Skúste to neskôr alebo nás kontaktujte e-mailom, ak je uvedený.",
      }, 503);
    }
  };
}