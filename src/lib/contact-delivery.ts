import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { inquiryServices, isEmailAddress, type ContactMode, type Inquiry } from "./contact-validation.ts";

type Environment = Record<string, string | undefined>;
type DeliveryOptions = { environment?: Environment; fetcher?: typeof fetch; storageDirectory?: string };
export type DeliveryReceipt = { id: string; delivery: "email" | "local" };

export class DeliveryError extends Error {
  readonly kind: "configuration" | "provider" | "storage";

  constructor(kind: DeliveryError["kind"]) {
    super(`Contact delivery unavailable: ${kind}`);
    this.name = "DeliveryError";
    this.kind = kind;
  }
}

export function getContactMode(environment: Environment = process.env): ContactMode {
  const key = environment.RESEND_API_KEY?.trim();
  const from = environment.CONTACT_FROM_EMAIL?.trim();
  const to = environment.CONTACT_TO_EMAIL?.trim();
  if (key && from && to && isEmailAddress(from) && isEmailAddress(to)) return "email";
  // Partial configuration is a mistake, not permission to silently write locally.
  if (key || from || to) return "unconfigured";
  return environment.NODE_ENV === "development" ? "local" : "unconfigured";
}

export async function deliverInquiry(inquiry: Inquiry, {
  environment = process.env,
  fetcher = fetch,
  storageDirectory = path.join(process.cwd(), ".data"),
}: DeliveryOptions = {}): Promise<DeliveryReceipt> {
  const mode = getContactMode(environment);
  if (mode === "unconfigured") throw new DeliveryError("configuration");

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  if (mode === "local") {
    try {
      await mkdir(storageDirectory, { recursive: true, mode: 0o700 });
      await appendFile(path.join(storageDirectory, "contact-submissions.ndjson"), `${JSON.stringify({ id, createdAt, ...inquiry })}\n`, { encoding: "utf8", mode: 0o600 });
    } catch {
      throw new DeliveryError("storage");
    }
    return { id, delivery: "local" };
  }

  const text = [
    "Nový dopyt — Eden Gardens",
    "",
    `Meno: ${inquiry.name}`,
    `E-mail: ${inquiry.email}`,
    `Telefón: ${inquiry.phone || "Neuvedený"}`,
    `Lokalita: ${inquiry.location || "Neuvedená"}`,
    `Služba: ${inquiryServices[inquiry.service]}`,
    "",
    inquiry.message,
    "",
    `Referencia: ${id}`,
    `Čas: ${createdAt}`,
    "Odosielateľ potvrdil oboznámenie s informáciami o spracúvaní údajov.",
  ].join("\n");

  try {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${environment.RESEND_API_KEY?.trim()}`, "Content-Type": "application/json", "Idempotency-Key": id },
      body: JSON.stringify({
        from: environment.CONTACT_FROM_EMAIL?.trim(),
        to: [environment.CONTACT_TO_EMAIL?.trim()],
        reply_to: inquiry.email,
        subject: `Eden Gardens · ${inquiryServices[inquiry.service]} · ${inquiry.name}`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new DeliveryError("provider");
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string" || !result.id) throw new DeliveryError("provider");
  } catch {
    // Never log provider responses, credentials, or the visitor's message.
    throw new DeliveryError("provider");
  }

  return { id, delivery: "email" };
}