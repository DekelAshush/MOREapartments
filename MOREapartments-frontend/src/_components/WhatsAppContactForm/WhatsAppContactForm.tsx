"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

type FormErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  service?: string;
};

function isValidIsraeliPhone(digits: string): boolean {
  const local = digits.startsWith("972") ? `0${digits.slice(3)}` : digits;

  if (!local.startsWith("0")) return false;

  // Mobile: 05X-XXXXXXX (10 digits)
  if (/^05\d{8}$/.test(local)) return true;

  // Landline: 02, 03, 04, 08, 09...
  if (/^0[2-489]\d{7,8}$/.test(local)) return true;

  // VoIP / 07X numbers
  if (/^07[2-9]\d{7}$/.test(local)) return true;

  return false;
}

function WhatsAppContactForm() {
  const t = useTranslations("WhatsAppForm");
  const locale = useLocale();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const sanitizePhone = (value: string) =>
    value.replace(/[\u200E\u200F\u202A-\u202E]/g, "").replace(/[^\d+\s-]/g, "");

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!firstName.trim()) newErrors.firstName = t("required");
    if (!lastName.trim()) newErrors.lastName = t("required");
    const cleanedPhone = sanitizePhone(phone.trim());
    const phoneDigits = cleanedPhone.replace(/\D/g, "");
    if (!cleanedPhone) newErrors.phone = t("required");
    else if (!isValidIsraeliPhone(phoneDigits))
      newErrors.phone = t("invalidPhone");
    if (!service.trim()) newErrors.service = t("required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    if (!validate()) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
      if (!apiUrl) {
        console.error("NEXT_PUBLIC_API_URL is not set");
        setStatus("error");
        return;
      }

      const response = await fetch(`${apiUrl}/api/whatsapp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          service,
          lang: locale,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorData: Record<string, unknown> = {};
        try {
          errorData = text ? JSON.parse(text) : {};
        } catch {
          errorData = text ? { message: text } : {};
        }
        console.error("API Error:", response.status, errorData);
        throw new Error("Failed sending WhatsApp message");
      }

      setStatus("success");
      setFirstName("");
      setLastName("");
      setPhone("");
      setService("");
      setErrors({});
    } catch (err) {
      console.error("Backend send error:", err);
      setStatus("error");
    }
  };

  return (
    <form
      className="mx-auto mt-6 max-w-lg rounded-2xl border border-blue-200 bg-white/95 p-6 shadow-lg backdrop-blur-md"
      onSubmit={onSubmit}
      noValidate
    >
      <h2 className="mb-4 text-xl font-semibold !text-black">
        {t("heading")}
      </h2>

      {status === "success" && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {t("success")}
        </p>
      )}
      {status === "error" && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {t("error")}
        </p>
      )}

      <div className="mb-3 grid gap-1">
        <label className="font-semibold text-gray-800" htmlFor="wa-first-name">
          {t("firstName")}
        </label>
        <input
          id="wa-first-name"
          className={`rounded-lg border px-3 py-2 text-base text-gray-900 ${
            errors.firstName ? "border-red-500" : "border-gray-300"
          }`}
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName ? (
          <span className="text-sm text-red-500">{errors.firstName}</span>
        ) : null}
      </div>

      <div className="mb-3 grid gap-1">
        <label className="font-semibold text-gray-800" htmlFor="wa-last-name">
          {t("lastName")}
        </label>
        <input
          id="wa-last-name"
          className={`rounded-lg border px-3 py-2 text-base text-gray-900 ${
            errors.lastName ? "border-red-500" : "border-gray-300"
          }`}
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName ? (
          <span className="text-sm text-red-500">{errors.lastName}</span>
        ) : null}
      </div>

      <div className="mb-3 grid gap-1">
        <label className="font-semibold text-gray-800" htmlFor="wa-phone">
          {t("phone")}
        </label>
        <input
          id="wa-phone"
          className={`rounded-lg border px-3 py-2 text-base text-gray-900 ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(sanitizePhone(e.target.value))}
          required
        />
        {errors.phone ? (
          <span className="text-sm text-red-500">{errors.phone}</span>
        ) : null}
      </div>

      <div className="mb-3 grid gap-1">
        <label className="font-semibold text-gray-800" htmlFor="wa-service">
          {t("service")}
        </label>
        <input
          id="wa-service"
          className={`rounded-lg border px-3 py-2 text-base text-gray-900 ${
            errors.service ? "border-red-500" : "border-gray-300"
          }`}
          type="text"
          placeholder={t("servicePlaceholder")}
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        />
        {errors.service ? (
          <span className="text-sm text-red-500">{errors.service}</span>
        ) : null}
      </div>

      <div className="mt-3 flex justify-center">
        <button
          type="submit"
          className="cursor-pointer rounded-lg border-none bg-[#25D366] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#128C7E]"
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
}

export default WhatsAppContactForm;
