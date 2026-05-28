import { getRates } from "../../Services/smoobuClient.js";
import { resolveSmoobuApartmentId } from "../../Services/smoobuMapping.js";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value) {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function normalizeDayRates(smoobuId, data) {
  const smoobuIdKey = String(smoobuId);
  const apartmentRates = data?.data?.[smoobuIdKey] || data?.data?.[smoobuId] || {};

  return Object.entries(apartmentRates).map(([date, info]) => ({
    date,
    price: info?.price ?? null,
    minLengthOfStay: info?.min_length_of_stay ?? null,
    available: info?.available === 1,
  }));
}

export async function getApartmentRates(req, res) {
  try {
    const { apartmentId, startDate, endDate } = req.query;

    if (!apartmentId || !startDate || !endDate) {
      return res.status(400).json({
        error: "apartmentId, startDate, and endDate are required",
      });
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end) {
      return res.status(400).json({ error: "Dates must be in yyyy-mm-dd format" });
    }

    if (end < start) {
      return res.status(400).json({ error: "endDate must be on or after startDate" });
    }

    const smoobuId = resolveSmoobuApartmentId(apartmentId);
    if (!smoobuId) {
      return res.status(404).json({ error: "Apartment is not linked to Smoobu" });
    }

    const data = await getRates({
      apartmentIds: [smoobuId],
      startDate,
      endDate,
    });

    return res.json({
      days: normalizeDayRates(smoobuId, data),
    });
  } catch (error) {
    console.error("Smoobu rates fetch failed:", error);
    return res.status(error.status || 500).json({
      error: error.message || "Failed to fetch rates",
    });
  }
}
