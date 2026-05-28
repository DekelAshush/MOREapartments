"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { hasSmoobuMapping } from "@/data/smoobu-apartments";
import { formatCurrency } from "@/utils/currency";

type AvailabilityResult = {
  available: boolean;
  price: number | null;
  currency: string | null;
  errorCode: number | null;
  errorDetails: {
    message?: string;
    minimumLengthOfStay?: number;
  } | null;
};

type Props = {
  apartmentId: string;
  initialArrivalDate?: string;
};

function ApartmentAvailability({ apartmentId, initialArrivalDate = "" }: Props) {
  const t = useTranslations("Properties");
  const [arrivalDate, setArrivalDate] = useState(initialArrivalDate);
  const [departureDate, setDepartureDate] = useState("");
  const [guests, setGuests] = useState("2");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  useEffect(() => {
    if (initialArrivalDate) {
      setArrivalDate(initialArrivalDate);
    }
  }, [initialArrivalDate]);

  if (!hasSmoobuMapping(apartmentId)) {
    return null;
  }

  const getErrorMessage = (availability: AvailabilityResult) => {
    if (availability.errorCode) {
      const key = `availabilityErrors.${availability.errorCode}` as never;
      if (t.has(key)) {
        return t(key);
      }
    }
    return availability.errorDetails?.message || t("notAvailable");
  };

  const handleCheck = async () => {
    setErrorMessage(null);
    setResult(null);

    if (!arrivalDate || !departureDate || departureDate <= arrivalDate) {
      setErrorMessage(t("invalidDates"));
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    if (!apiUrl) {
      setErrorMessage(t("availabilityRequestFailed"));
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        apartmentId,
        arrivalDate,
        departureDate,
        guests,
      });

      const response = await fetch(`${apiUrl}/api/smoobu/availability?${params}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage(t("availabilityNotLinked"));
        } else {
          setErrorMessage(data.error || t("availabilityRequestFailed"));
        }
        return;
      }

      setResult(data as AvailabilityResult);
    } catch {
      setErrorMessage(t("availabilityRequestFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-blue-100 bg-slate-50 p-4">
      <h5 className="mb-3 text-sm font-semibold text-brand-blue-dark">
        {t("availabilityTitle")}
      </h5>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          <span>{t("checkIn")}</span>
          <input
            type="date"
            value={arrivalDate}
            onChange={(event) => setArrivalDate(event.target.value)}
            className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-slate-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          <span>{t("checkOut")}</span>
          <input
            type="date"
            value={departureDate}
            onChange={(event) => setDepartureDate(event.target.value)}
            className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-slate-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 sm:col-span-2">
          <span>{t("guests")}</span>
          <input
            type="number"
            min={1}
            max={12}
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-slate-800"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleCheck}
        disabled={loading}
        className="mt-3 w-full rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t("checking") : t("checkAvailability")}
      </button>

      {errorMessage ? (
        <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      {result ? (
        <div className="mt-3 text-sm">
          {result.available ? (
            <div className="space-y-1 text-green-700">
              <p className="font-medium">{t("availableForDates")}</p>
              {result.price != null && result.currency ? (
                <p>
                  {t("priceForStay", {
                    price: result.price,
                    currency: formatCurrency(result.currency),
                  })}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-red-600">{getErrorMessage(result)}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ApartmentAvailability;
