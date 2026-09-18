export const inquiryServices = {
  navrh: "Návrh záhrady",
  realizacia: "Realizácia",
  udrzba: "Údržba",
  zavlahy: "Závlahy / zeleň",
  ine: "Chcem sa poradiť",
} as const;

export type InquiryService = keyof typeof inquiryServices;
export type Inquiry = {
  name: string;
  email: string;
  phone: string;
  location: string;
  service: InquiryService;
  message: string;
  consent: true;
};
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export type ContactMode = "email" | "local" | "unconfigured";
export type ValidationResult = { success: true; data: Inquiry } | { success: false; errors: InquiryErrors };

export function isInquiryService(value: unknown): value is InquiryService {
  return typeof value === "string" && Object.hasOwn(inquiryServices, value);
}

export function isEmailAddress(value: string) {
  const hasControlCharacter = Array.from(value).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
  return value.length <= 254 && !hasControlCharacter && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

export function validateInquiry(input: unknown): ValidationResult {
  const source: Record<string, unknown> = input !== null && typeof input === "object" && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
  const text = (key: string) => typeof source[key] === "string" ? source[key].trim() : "";
  const name = text("name");
  const email = text("email");
  const phone = text("phone");
  const location = text("location");
  const service = text("service");
  const message = text("message");
  const errors: InquiryErrors = {};

  if (name.length < 2 || name.length > 100 || /[\r\n]/.test(name) || name.includes("\0")) errors.name = "Zadajte meno v rozsahu 2 až 100 znakov.";
  if (!isEmailAddress(email)) errors.email = "Zadajte platnú e-mailovú adresu.";
  if ((source.phone !== undefined && typeof source.phone !== "string") || (phone && (!/^[+\d\s()./\-]{7,30}$/.test(phone) || phone.replace(/\D/g, "").length < 7 || /[\r\n]/.test(phone)))) errors.phone = "Zadajte platné telefónne číslo alebo pole nechajte prázdne.";
  if ((source.location !== undefined && typeof source.location !== "string") || location.length > 120 || /[\r\n]/.test(location) || location.includes("\0")) errors.location = "Lokalita môže mať najviac 120 znakov na jednom riadku.";
  if (!isInquiryService(service)) errors.service = "Vyberte službu, o ktorú máte záujem.";
  if (message.length < 20 || message.length > 4000 || message.includes("\0")) errors.message = "Napíšte nám 20 až 4 000 znakov o vašej predstave.";
  if (source.consent !== true) errors.consent = "Potvrďte, že ste sa oboznámili s informáciami o spracúvaní údajov.";

  if (Object.keys(errors).length || !isInquiryService(service)) return { success: false, errors };
  return { success: true, data: { name, email, phone, location, service, message, consent: true } };
}