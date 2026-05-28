"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { hasSmoobuMapping } from "@/data/smoobu-apartments";
import { formatPrice } from "@/utils/currency";

type DayRate = {
  date: string;
  price: number | null;
  minLengthOfStay: number | null;
  available: boolean;
};

type Props = {
  apartmentId: string;
  onSelectDate?: (date: string) => void;
  selectedDate?: string;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ApartmentCalendar({ apartmentId, onSelectDate, selectedDate }: Props) {
  const t = useTranslations("Properties");
  const locale = useLocale();
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [days, setDays] = useState<DayRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        visibleMonth,
      ),
    [locale, visibleMonth],
  );

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const start = new Date(2026, 0, 4);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return formatter.format(date);
    });
  }, [locale]);

  const calendarCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const leadingEmpty = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const cells: Array<{ date: string | null; dayNumber: number | null }> = [];

    for (let i = 0; i < leadingEmpty; i += 1) {
      cells.push({ date: null, dayNumber: null });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = formatDate(new Date(year, month, day));
      cells.push({ date, dayNumber: day });
    }

    return cells;
  }, [visibleMonth]);

  const dayMap = useMemo(
    () => new Map(days.map((day) => [day.date, day])),
    [days],
  );

  const loadRates = useCallback(async () => {
    if (!hasSmoobuMapping(apartmentId)) {
      setDays([]);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    if (!apiUrl) {
      setErrorMessage(t("calendarLoadFailed"));
      return;
    }

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const startDate = formatDate(new Date(year, month, 1));
    const endDate = formatDate(new Date(year, month + 1, 0));

    setLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams({
        apartmentId,
        startDate,
        endDate,
      });
      const response = await fetch(`${apiUrl}/api/smoobu/rates?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || t("calendarLoadFailed"));
        setDays([]);
        return;
      }

      setDays(data.days ?? []);
    } catch {
      setErrorMessage(t("calendarLoadFailed"));
      setDays([]);
    } finally {
      setLoading(false);
    }
  }, [apartmentId, t, visibleMonth]);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  if (!hasSmoobuMapping(apartmentId)) {
    return null;
  }

  const today = formatDate(new Date());

  return (
    <section className="rounded-xl border border-blue-100 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-brand-blue-dark">
          {t("calendarTitle")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setVisibleMonth(
                (current) =>
                  new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
            className="rounded-lg border border-blue-100 px-3 py-1 text-sm text-brand-blue-dark hover:bg-brand-blue-soft"
            aria-label={t("previousMonth")}
          >
            ‹
          </button>
          <span className="min-w-[9rem] text-center text-sm font-medium text-slate-700">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() =>
              setVisibleMonth(
                (current) =>
                  new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
            className="rounded-lg border border-blue-100 px-3 py-1 text-sm text-brand-blue-dark hover:bg-brand-blue-soft"
            aria-label={t("nextMonth")}
          >
            ›
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="py-1 text-center text-xs font-medium text-slate-500"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((cell, index) => {
          if (!cell.date || cell.dayNumber == null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const cellDate = cell.date;
          const dayInfo = dayMap.get(cellDate);
          const isPast = cellDate < today;
          const isAvailable = dayInfo?.available === true;
          const isSelected = selectedDate === cellDate;

          return (
            <button
              key={cellDate}
              type="button"
              disabled={isPast || !isAvailable}
              onClick={() => onSelectDate?.(cellDate)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition-colors ${
                isSelected
                  ? "border-brand-blue bg-brand-blue text-white"
                  : isPast
                    ? "border-transparent bg-slate-50 text-slate-300"
                    : isAvailable
                      ? "border-green-100 bg-green-50 text-green-800 hover:border-green-300"
                      : "border-red-100 bg-red-50 text-red-400"
              }`}
            >
              <span className="font-semibold">{cell.dayNumber}</span>
              {dayInfo?.price != null && isAvailable ? (
                <span className="mt-0.5 text-[10px] leading-none">
                  {formatPrice(dayInfo.price)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-green-50 ring-1 ring-green-100" />
          {t("calendarAvailable")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-red-50 ring-1 ring-red-100" />
          {t("calendarUnavailable")}
        </span>
      </div>

      {loading ? (
        <p className="mt-3 text-sm text-slate-500">{t("calendarLoading")}</p>
      ) : null}
      {errorMessage ? (
        <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </section>
  );
}

export default ApartmentCalendar;
