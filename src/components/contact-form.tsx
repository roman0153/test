"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/icons";
import { inquiryServices, validateInquiry, type ContactMode, type InquiryErrors, type InquiryService } from "@/lib/contact-validation";

type Status = { type: "idle" | "sending" | "success" | "local" | "error"; message: string; id?: string };

export function ContactForm({ defaultService = "ine", mode }: { defaultService?: InquiryService; mode: ContactMode }) {
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const inFlight = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  function focusFirstError(form: HTMLFormElement, fieldErrors: InquiryErrors) {
    const firstName = Object.keys(fieldErrors)[0];
    const field = firstName ? form.elements.namedItem(firstName) : null;
    if (field instanceof HTMLElement) field.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const result = validateInquiry({
      name: fields.get("name"), email: fields.get("email"), phone: fields.get("phone"),
      location: fields.get("location"), service: fields.get("service"), message: fields.get("message"),
      consent: fields.get("consent") === "on",
    });
    if (!result.success) {
      setErrors(result.errors);
      setStatus({ type: "error", message: "Skontrolujte označené polia formulára." });
      focusFirstError(form, result.errors);
      return;
    }

    inFlight.current = true;
    setErrors({});
    setStatus({ type: "sending", message: "Odosielam správu…" });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: fields.get("website") || "" }),
        signal: controller.signal,
      });
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || !("message" in payload) || typeof payload.message !== "string") throw new Error("Invalid server response");
      if (!response.ok) {
        setStatus({ type: "error", message: payload.message });
        if ("errors" in payload && payload.errors && typeof payload.errors === "object") {
          const fieldErrors: InquiryErrors = {};
          for (const key of ["name", "email", "phone", "location", "service", "message", "consent"] as const) {
            const value: unknown = (payload.errors as Record<string, unknown>)[key];
            if (typeof value === "string") fieldErrors[key] = value;
          }
          setErrors(fieldErrors);
          focusFirstError(form, fieldErrors);
        } else {
          window.requestAnimationFrame(() => statusRef.current?.focus());
        }
        return;
      }
      if (!("delivery" in payload) || !["email", "local"].includes(String(payload.delivery)) || !("id" in payload) || typeof payload.id !== "string") throw new Error("Missing delivery receipt");
      setStatus({ type: payload.delivery === "local" ? "local" : "success", message: payload.message, id: payload.id });
      form.reset();
      window.requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setStatus({ type: "error", message: "Odoslanie sa nepodarilo potvrdiť. Skontrolujte pripojenie a skúste to neskôr. Text správy zostal vo formulári." });
      window.requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
    }
  }

  function fieldProps(name: keyof InquiryErrors) {
    return { disabled: status.type === "sending", "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${name}-error` : undefined };
  }

  function fieldError(name: keyof InquiryErrors) {
    return errors[name] ? <span className="field-error" id={`${name}-error`}>{errors[name]}</span> : null;
  }

  return (
    <form className="contact-form" action="/api/contact" method="post" onSubmit={handleSubmit} noValidate aria-label="Dopyt na záhradný projekt" aria-busy={status.type === "sending"}>
      <div className="form-heading"><h2>Povedzte nám o svojej predstave.</h2><p>Polia označené hviezdičkou sú povinné.</p></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Toto pole nechajte prázdne</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="name">Vaše meno <span>*</span></label><input id="name" name="name" autoComplete="name" placeholder="Meno a priezvisko" required minLength={2} maxLength={100} {...fieldProps("name")} />{fieldError("name")}</div>
        <div className="form-field"><label htmlFor="email">E-mail <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" placeholder="vas@email.sk" required maxLength={254} {...fieldProps("email")} />{fieldError("email")}</div>
        <div className="form-field"><label htmlFor="phone">Telefón</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+421" maxLength={30} {...fieldProps("phone")} />{fieldError("phone")}</div>
        <div className="form-field"><label htmlFor="location">Lokalita projektu</label><input id="location" name="location" autoComplete="address-level2" placeholder="Mesto alebo obec" maxLength={120} {...fieldProps("location")} />{fieldError("location")}</div>
        <div className="form-field form-field--wide"><label htmlFor="service">S čím vám môžeme pomôcť? <span>*</span></label><select id="service" name="service" defaultValue={defaultService} required {...fieldProps("service")}>{Object.entries(inquiryServices).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>{fieldError("service")}</div>
        <div className="form-field form-field--wide"><label htmlFor="message">Vaša predstava <span>*</span></label><textarea id="message" name="message" placeholder="Aká by mala byť vaša záhrada? Napíšte nám o priestore, vašich predstavách alebo plánovanom termíne…" rows={6} required minLength={20} maxLength={4000} {...fieldProps("message")} />{fieldError("message")}</div>
      </div>
      <div className="consent-field"><label className="consent-label" htmlFor="consent"><input type="checkbox" id="consent" name="consent" required {...fieldProps("consent")} /><span>Oboznámil/a som sa s <Link href="/ochrana-sukromia" target="_blank" rel="noopener noreferrer">informáciami o spracúvaní osobných údajov<span className="visually-hidden"> (otvorí sa v novom okne)</span></Link>. <span aria-hidden="true">*</span></span></label>{fieldError("consent")}</div>
      <div className="form-bottom"><p>Dobrá záhrada sa začína dobrým rozhovorom.</p><button type="submit" className="solid-button" disabled={status.type === "sending"}>{status.type === "sending" ? <>Odosielam<span className="form-spinner" aria-hidden="true" /></> : <>Odoslať správu<ArrowIcon /></>}</button></div>
      <div aria-live="polite" aria-atomic="true">{status.message && status.type !== "sending" && <div ref={statusRef} tabIndex={-1} className={`form-status form-status--${status.type}`} role={status.type === "error" ? "alert" : "status"}><strong>{status.type === "success" ? "Ďakujeme za váš záujem." : status.type === "local" ? "Uložené v lokálnom ukážkovom režime." : "Správa vyžaduje vašu pozornosť."}</strong><p>{status.message}</p>{status.id && <p>Referencia: <code>{status.id}</code></p>}</div>}</div>
      {mode === "local" && <p className="form-demo-note">Lokálny ukážkový režim: správy sa ukladajú iba na počítači, kde beží web. E-mail sa neodosiela. Neposielajte citlivé údaje.</p>}
      {mode === "unconfigured" && <p className="form-demo-note">Doručovanie formulára ešte nie je nakonfigurované. Správu zatiaľ nie je možné odoslať.</p>}
      <noscript><p className="form-status form-status--error">Na odoslanie formulára je potrebný JavaScript. Použite uvedený e-mail, ak je nastavený.</p></noscript>
    </form>
  );
}