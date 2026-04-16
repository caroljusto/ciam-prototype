import { PERSONAL_EMAIL_DOMAINS } from "./constants";

export function validateWorkEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  if (!emailIsValid) {
    return { ok: false, emailErr: true, domainErr: false };
  }
  const domain = normalizedEmail.split("@")[1] || "";
  if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return { ok: false, emailErr: false, domainErr: true };
  }
  return { ok: true, emailErr: false, domainErr: false };
}
