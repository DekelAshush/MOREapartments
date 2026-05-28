const EURO_ALIASES = new Set(["€", "eur", "euro", "euros"]);
const SHEKEL_ALIASES = new Set(["₪", "ils", "nis", "shekel", "shekels"]);

export function formatCurrency(currency: string | null | undefined): string {
  if (currency == null || currency === "") {
    return "₪";
  }

  const value = currency.trim();
  const normalized = value.toLowerCase();

  if (EURO_ALIASES.has(value) || EURO_ALIASES.has(normalized)) {
    return "₪";
  }

  if (SHEKEL_ALIASES.has(value) || SHEKEL_ALIASES.has(normalized)) {
    return "₪";
  }

  return value;
}

export function formatPrice(price: number, currency?: string | null): string {
  return `${price} ${formatCurrency(currency)}`;
}
