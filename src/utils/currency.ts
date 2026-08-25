import type { Currency } from "../context/PreferencesContext"

const currencyLocales: Record<Currency, string> = {
  NGN: "en-NG",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
}

export function formatCurrency(
  amount: number,
  currency: Currency = "NGN",
): string {
  return new Intl.NumberFormat(currencyLocales[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}