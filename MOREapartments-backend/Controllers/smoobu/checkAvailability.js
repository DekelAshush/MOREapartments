import { checkApartmentAvailability } from "../../Services/smoobuClient.js";
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

function normalizeAvailabilityResponse(smoobuId, data) {
  const smoobuIdKey = String(smoobuId);
  const isAvailable = data.availableApartments?.includes(smoobuId)
    || data.availableApartments?.includes(Number(smoobuId));

  if (isAvailable) {
    const priceInfo = data.prices?.[smoobuIdKey] || data.prices?.[smoobuId];
    return {
      available: true,
      price: priceInfo?.price ?? null,
      currency: priceInfo?.currency ?? null,
      errorCode: null,
      errorDetails: null,
    };
  }

  const errorInfo = data.errorMessages?.[smoobuIdKey] || data.errorMessages?.[smoobuId];
  return {
    available: false,
    price: null,
    currency: null,
    errorCode: errorInfo?.errorCode ?? null,
    errorDetails: errorInfo ?? null,
  };
}

export async function checkAvailability(req, res) {
  try {
    const { apartmentId, arrivalDate, departureDate, guests } = req.query;

    if (!apartmentId || !arrivalDate || !departureDate) {
      return res.status(400).json({
        error: "apartmentId, arrivalDate, and departureDate are required",
      });
    }

    const arrival = parseDate(arrivalDate);
    const departure = parseDate(departureDate);

    if (!arrival || !departure) {
      return res.status(400).json({ error: "Dates must be in yyyy-mm-dd format" });
    }

    if (departure <= arrival) {
      return res.status(400).json({ error: "departureDate must be after arrivalDate" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (arrival < today) {
      return res.status(400).json({ error: "arrivalDate cannot be in the past" });
    }

    const smoobuId = resolveSmoobuApartmentId(apartmentId);
    if (!smoobuId) {
      return res.status(404).json({ error: "Apartment is not linked to Smoobu" });
    }

    const data = await checkApartmentAvailability({
      arrivalDate,
      departureDate,
      apartmentIds: [smoobuId],
      guests,
    });

    return res.json(normalizeAvailabilityResponse(smoobuId, data));
  } catch (error) {
    console.error("Smoobu availability check failed:", error);
    return res.status(error.status || 500).json({
      error: error.message || "Failed to check availability",
    });
  }
}
