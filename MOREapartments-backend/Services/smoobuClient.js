const SMOOBU_BASE_URL = "https://login.smoobu.com";

let cachedCustomerId = null;
let customerIdExpiresAt = 0;
const CUSTOMER_ID_TTL_MS = 60 * 60 * 1000;

function getApiKey() {
  const apiKey = process.env.SMOOBU_API_KEY;
  if (!apiKey) {
    throw new Error("SMOOBU_API_KEY is not configured");
  }
  return apiKey;
}

async function smoobuFetch(path, options = {}) {
  const response = await fetch(`${SMOOBU_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Api-Key": getApiKey(),
      "Cache-Control": "no-cache",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const error = new Error(data?.detail || data?.title || `Smoobu API error (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function getCustomerId() {
  const now = Date.now();
  if (cachedCustomerId && now < customerIdExpiresAt) {
    return cachedCustomerId;
  }

  const profile = await smoobuFetch("/api/me");
  cachedCustomerId = profile.id;
  customerIdExpiresAt = now + CUSTOMER_ID_TTL_MS;
  return cachedCustomerId;
}

export async function checkApartmentAvailability({
  arrivalDate,
  departureDate,
  apartmentIds,
  guests,
}) {
  const customerId = await getCustomerId();
  const body = {
    arrivalDate,
    departureDate,
    apartments: apartmentIds,
    customerId,
  };

  if (guests) {
    body.guests = Number(guests);
  }

  return smoobuFetch("/booking/checkApartmentAvailability", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function listApartments() {
  return smoobuFetch("/api/apartments");
}
